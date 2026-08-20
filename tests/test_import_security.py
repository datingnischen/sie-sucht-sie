import unittest
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup
from scripts.import_public_pages import clean_content, safe_href, verified_preceding_statistics_image


class ImportSecurityTests(unittest.TestCase):
    def test_statistics_image_verification_fails_closed(self):
        asset_id = "1C77F826642907FF8CC1C0C57AF48D532202C05892EE2D707B4862543E20201B"
        valid_url = f"https://static-cms.icony-hosting.de/cms/{asset_id}/1000/Wien.jpg"

        def predecessor(markup):
            soup = BeautifulSoup(f"<main>{markup}<h2 id='statistics'>Dating-Statistik</h2></main>", "html.parser")
            return soup, soup.select_one("#statistics")

        soup, heading = predecessor(f'<h2 id="candidate"><img src="{valid_url}" alt="Wien"></h2>')
        self.assertIs(verified_preceding_statistics_image(heading), soup.select_one("#candidate"))

        invalid_predecessors = [
            f'<h2><span><img src="{valid_url}" alt="Wien"></span></h2>',
            f'<h2><img src="{valid_url}" alt="Wien"><img alt="ohne src"></h2>',
            f'<h2><img src="https://evil.example/cms/{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
            f'<h2><img src="https://static-cms.icony-hosting.de/image.jpg?asset=/cms/{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
            f'<h2><img src="https://static-cms.icony-hosting.de/image.jpg#cms/{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
            f'<h2><img src="/cms/{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
            f'<h2><img src="https://user@static-cms.icony-hosting.de/cms/{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
            f'<h2><img src="https://static-cms.icony-hosting.de:443/cms/{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
            f'<h2><img src="https://static-cms.icony-hosting.de/cms/NOT{asset_id}/1000/Wien.jpg" alt="Wien"></h2>',
        ]
        for markup in invalid_predecessors:
            with self.subTest(markup=markup):
                _, heading = predecessor(markup)
                self.assertIsNone(verified_preceding_statistics_image(heading))

    def test_location_snapshot_contains_no_legacy_statistics_or_broken_heading_wrappers(self):
        catalog = json.loads((Path(__file__).parents[1] / "data" / "pages.json").read_text(encoding="utf-8"))["pages"]
        offenders = []
        for page in (item for item in catalog if item["type"] == "location"):
            soup = BeautifulSoup(page["contentHtml"], "html.parser")
            if any(re.search(r"(?:dating.*statistik|flirt-faktor)", heading.get_text(" ", strip=True), re.IGNORECASE) for heading in soup.find_all(["h2", "h3"])):
                offenders.append((page["path"], "statistics"))
            if any(heading.find("img") and not heading.get_text(" ", strip=True) for heading in soup.find_all(["h2", "h3", "h4"])):
                offenders.append((page["path"], "image-heading"))
            if any(not heading.get_text(" ", strip=True) and not heading.find("img") for heading in soup.find_all(["h2", "h3", "h4"])):
                offenders.append((page["path"], "empty-heading"))
            if any(not paragraph.get_text(" ", strip=True) and not paragraph.find("img") for paragraph in soup.find_all("p")):
                offenders.append((page["path"], "empty-paragraph"))
        self.assertEqual(offenders, [])

    def test_rejects_active_url_schemes_and_excluded_review_host(self):
        source = "https://www.sie-sucht-sie.de/partnersuche/berlin/"
        self.assertIsNone(safe_href("javascript:alert(1)", source))
        self.assertIsNone(safe_href("data:text/html,unsafe", source))
        self.assertIsNone(safe_href("https://singleboersen-ueberblick.de/tracking", source))

    def test_normalizes_known_internal_link_errors(self):
        source = "https://www.sie-sucht-sie.de/lexikon/"
        self.assertEqual(safe_href("../../lexikon/lesbenseiten", source), "/lexikon/lesbenseiten")
        self.assertEqual(safe_href("/schweiz/winterhur", source), "/schweiz/winterthur")
        self.assertEqual(safe_href("/videodate.html", source), "/videodating.html")
        self.assertEqual(safe_href("/startseite", source), "/")
        self.assertEqual(
            safe_href("hhttps://www.sie-sucht-sie.de/partnersuche/hamburg/", source),
            "/partnersuche/hamburg",
        )

    def test_sanitizer_uses_strict_markup_and_resource_allowlists(self):
        markup = """
        <main>
          <script>alert(1)</script><iframe src="https://js.icony.com/frame/x"></iframe>
          <form><input name="private"></form><video src="https://evil.example/video"></video>
          <a href="javascript:alert(1)">unsafe</a>
          <a href="/registration/?AID=location">register</a>
          <img src="https://singleboersen-ueberblick.de/pixel.png" alt="tracking">
          <img src="https://static-cms.icony-hosting.de/cms/city.jpg" alt="city" onerror="alert(1)">
        </main>
        """
        cleaned = clean_content(
            BeautifulSoup(markup, "html.parser"),
            "location",
            "https://www.sie-sucht-sie.de/partnersuche/berlin/",
        )
        for forbidden in ("<script", "<iframe", "<form", "<video", "javascript:", "onerror", "singleboersen-ueberblick.de"):
            self.assertNotIn(forbidden, cleaned.lower())
        cleaned_soup = BeautifulSoup(cleaned, "html.parser")
        registration = cleaned_soup.find("a", class_="inline-content-cta")
        self.assertEqual(registration["href"], "https://www.sie-sucht-sie.de/registration/?AID=location")
        self.assertIn('src="https://static-cms.icony-hosting.de/cms/city.jpg"', cleaned)

    def test_fragment_drops_renderer_owned_main_and_h1_but_preserves_article_structure(self):
        markup = """
        <main id="static">
          <h1>Imported duplicate title</h1>
          <p>Useful introduction.</p>
          <h2>Useful section</h2>
          <p>Useful details.</p>
        </main>
        """
        cleaned = clean_content(
            BeautifulSoup(markup, "html.parser"),
            "lexicon",
            "https://www.sie-sucht-sie.de/lexikon/example",
        )
        self.assertNotIn("<main", cleaned)
        self.assertNotIn("<h1", cleaned)
        self.assertIn("<h2>Useful section</h2>", cleaned)
        self.assertIn("Useful introduction.", cleaned)
        self.assertIn("Useful details.", cleaned)

    def test_importer_classifies_only_text_registration_ctas(self):
        markup = """
        <main id="static">
          <p><a href="/registration">Jetzt kostenlos registrieren</a></p>
          <p><a href="/registration/?ref=test">Mit Referenz registrieren</a></p>
          <p><a href="//www.sie-sucht-sie.de/registration">Protokollrelativ registrieren</a></p>
          <a href="/registration/profile">Registrierungsprofil</a>
          <a href="/registrationevil">Ähnlicher Pfad</a>
          <a href="https://www.sie-sucht-sie.de.evil.example/registration">Fremder Lookalike-Host</a>
          <a href="https://www.sie-sucht-sie.de:444/registration">Fremder Port</a>
          <a href="https://user@www.sie-sucht-sie.de/registration">URL mit Userinfo</a>
          <a href="/registration">Außen <a href="/registration">Innen</a></a>
          <a href="/registration"><img src="https://static-cms.icony-hosting.de/cms/promo.jpg" alt="Promo"></a>
          <a href="/registration"></a>
          <a href="/lexikon/lesbenseiten">Normaler Inhaltslink</a>
        </main>
        """
        editorial = clean_content(
            BeautifulSoup(markup, "html.parser"),
            "lexicon",
            "https://www.sie-sucht-sie.de/lexikon/example",
        )
        location = clean_content(
            BeautifulSoup(markup, "html.parser"),
            "location",
            "https://www.sie-sucht-sie.de/partnersuche/berlin",
        )
        editorial_soup = BeautifulSoup(editorial, "html.parser")
        location_soup = BeautifulSoup(location, "html.parser")
        self.assertEqual(len(editorial_soup.select("a.inline-content-cta")), 3)
        self.assertTrue(all(a["href"] == "https://www.sie-sucht-sie.de/registration/?AID=magazin" for a in editorial_soup.select("a.inline-content-cta")))
        self.assertEqual(location_soup.select_one("a.inline-content-cta")["href"], "https://www.sie-sucht-sie.de/registration/?AID=location")
        self.assertIsNone(editorial_soup.select_one('a[href="/registration/profile"].inline-content-cta'))
        self.assertIsNone(editorial_soup.select_one('a[href="/registrationevil"].inline-content-cta'))
        self.assertIsNone(editorial_soup.select_one('a[href*="evil.example"].inline-content-cta'))
        self.assertEqual(editorial_soup.select_one('a[href*="evil.example"]')["rel"], ["nofollow", "noopener", "noreferrer"])
        self.assertIsNone(editorial_soup.select_one('a[href*=":444/registration"].inline-content-cta'))
        self.assertEqual(editorial_soup.select_one('a[href*=":444/registration"]')["rel"], ["nofollow", "noopener", "noreferrer"])
        self.assertIsNone(editorial_soup.select_one('a[href*="user@"].inline-content-cta'))
        self.assertEqual(editorial_soup.select_one('a[href*="user@"]')["rel"], ["nofollow", "noopener", "noreferrer"])
        self.assertNotIn("Außen <a", editorial)
        self.assertIn("Außen Innen", editorial)
        self.assertIn('<a href="/lexikon/lesbenseiten">Normaler Inhaltslink</a>', editorial)
        self.assertEqual(editorial.count('<a href="https://www.sie-sucht-sie.de/registration">'), 2)

    def test_location_cleanup_removes_legacy_statistics_and_repairs_heading_structure(self):
        markup = """
        <main id="static">
          <h2>Lesbisch in Wien – Flirt & Dating Statistik</h2>
          <p>Unbelegte Statistik-Einleitung</p>
          <h3>👩‍❤️‍👩 Community in Wien</h3><p>ca. 40.000 Frauen</p>
          <h3>🔥 Flirt-Faktor: 89%</h3><p>Berechneter Index</p>
          <h2>Tolle Events zum Flirten in Wien</h2>
          <p>Dieser nützliche Eventtext bleibt erhalten.</p>
          <h3>Vienna Pride & LGBTQ+ Events</h3><p>Legitimer Community-Abschnitt.</p>
          <h2></h2><p>   </p>
        </main>
        """
        cleaned = clean_content(BeautifulSoup(markup, "html.parser"), "location", "https://www.sie-sucht-sie.de/oesterreich/wien")
        soup = BeautifulSoup(cleaned, "html.parser")
        self.assertNotIn("Statistik", cleaned)
        self.assertNotIn("Flirt-Faktor", cleaned)
        self.assertNotIn("Unbelegte Statistik-Einleitung", cleaned)
        self.assertIn("Tolle Events zum Flirten in Wien", cleaned)
        self.assertIn("Legitimer Community-Abschnitt", cleaned)
        self.assertIsNone(soup.find(["h2", "h3"], string=lambda value: value and "Wien2" in value))
        self.assertFalse(any(not heading.get_text(" ", strip=True) and not heading.find("img") for heading in soup.find_all(["h2", "h3", "h4"])))
        self.assertFalse(any(not paragraph.get_text(" ", strip=True) and not paragraph.find("img") for paragraph in soup.find_all("p")))

        augsburg = """
        <main><p>Die Einleitung bleibt.</p>
          <h3>👩‍❤️‍👩 Community in Augsburg</h3><p>Modellwert</p>
          <h3>💬 Dating-Aktivität</h3><p>Interne Auswertung</p>
          <h3>🔥 Flirt-Faktor: 87 %</h3><p>Berechneter Index</p>
          <h2>Tolle Events zum Flirten</h2><p>Nützlicher Augsburg-Text.</p>
        </main>
        """
        cleaned_augsburg = clean_content(BeautifulSoup(augsburg, "html.parser"), "location", "https://www.sie-sucht-sie.de/partnersuche/augsburg")
        self.assertIn("Die Einleitung bleibt", cleaned_augsburg)
        self.assertIn("Nützlicher Augsburg-Text", cleaned_augsburg)
        self.assertNotIn("Community in Augsburg", cleaned_augsburg)
        self.assertNotIn("Flirt-Faktor", cleaned_augsburg)

        duesseldorf = """
        <main><h2>Lesbisch in Düsseldorf – Dating-Statistik</h2>
          <h3>👩‍❤️‍👩 Community in Düsseldorf</h3><p>Modellwert</p>
          <h3>🔥 Flirt-Faktor: 88%</h3><p>Berechneter Index</p><p></p>
          <p>Gleichgeschlechtliche Liebe und nützliche Date-Ideen in Düsseldorf.</p>
          <p><a href="/registration">Jetzt kostenlos registrieren</a></p>
        </main>
        """
        cleaned_duesseldorf = clean_content(BeautifulSoup(duesseldorf, "html.parser"), "location", "https://www.sie-sucht-sie.de/partnersuche/duesseldorf")
        self.assertNotIn("Dating-Statistik", cleaned_duesseldorf)
        self.assertNotIn("Flirt-Faktor", cleaned_duesseldorf)
        self.assertIn("nützliche Date-Ideen", cleaned_duesseldorf)
        self.assertIn("Jetzt kostenlos registrieren", cleaned_duesseldorf)

        section_variant = """
        <main><h2>Lesbisch in Köln – Dating-Statistik</h2>
          <p><a href="/registration">Frauen aus Köln finden</a></p>
          <section><p>Unbelegte Statistik</p><h3>🔥 Flirt-Faktor: 91%</h3><p>Berechneter Index</p></section>
          <h2>Wenn zwei Frauen sich in Köln treffen</h2><p>Nützlicher Köln-Text.</p>
        </main>
        """
        cleaned_section = clean_content(BeautifulSoup(section_variant, "html.parser"), "location", "https://www.sie-sucht-sie.de/partnersuche/koeln")
        self.assertNotIn("Dating-Statistik", cleaned_section)
        self.assertNotIn("Flirt-Faktor", cleaned_section)
        self.assertIn("Frauen aus Köln finden", cleaned_section)
        self.assertIn("Nützlicher Köln-Text", cleaned_section)

        image_variant = """
        <main><h2><img src="https://static-cms.icony-hosting.de/cms/1C77F826642907FF8CC1C0C57AF48D532202C05892EE2D707B4862543E20201B/1000/Wien.jpg" alt="Wien"></h2><p></p>
          <h2>Lesbisch in Wien – Flirt & Dating Statistik</h2>
          <h3>👩‍❤️‍👩 Community in Wien</h3><p>Modellwert</p>
          <h3>🔥 Flirt-Faktor: 89%</h3><p>Berechneter Index</p><p></p>
          <h2><img src="https://static-cms.icony-hosting.de/cms/city/1000/Wien2.jpg" alt="Wien2"></h2>
          <h2>Tolle Events zum Flirten in Wien</h2><p>Nützlicher Wien-Text.</p>
        </main>
        """
        cleaned_images = clean_content(BeautifulSoup(image_variant, "html.parser"), "location", "https://www.sie-sucht-sie.de/oesterreich/wien")
        self.assertNotIn("Wien.jpg", cleaned_images)
        self.assertIn("Wien2.jpg", cleaned_images)
        self.assertNotIn("<h2><img", cleaned_images)
        self.assertIn("Tolle Events zum Flirten in Wien", cleaned_images)

        representative_before_module = """
        <main><h2><img src="https://static-cms.icony-hosting.de/cms/CITYASSET/1000/representative-city.jpg" alt="Repräsentatives Stadtbild"></h2>
          <h2>Lesbisch in Beispielstadt – Dating-Statistik</h2>
          <h3>👩‍❤️‍👩 Community in Beispielstadt</h3><p>Modellwert</p>
          <h3>🔥 Flirt-Faktor: 80%</h3><p>Berechneter Index</p>
          <h2>Nützliche Date-Ideen</h2><p>Redaktioneller Text.</p>
        </main>
        """
        cleaned_representative = clean_content(BeautifulSoup(representative_before_module, "html.parser"), "location", "https://www.sie-sucht-sie.de/partnersuche/beispielstadt")
        self.assertIn("representative-city.jpg", cleaned_representative)
        self.assertNotIn("Dating-Statistik", cleaned_representative)

        incomplete_module = """
        <main><h2><img src="https://static-cms.icony-hosting.de/cms/1C77F826642907FF8CC1C0C57AF48D532202C05892EE2D707B4862543E20201B/1000/Wien.jpg" alt="Wien"></h2>
          <h2>Lesbisch in Wien – Flirt & Dating Statistik</h2>
          <p>Kein vollständiges Statistikmodul.</p>
          <h2>Nützlicher Folgeabschnitt</h2>
        </main>
        """
        cleaned_incomplete = clean_content(BeautifulSoup(incomplete_module, "html.parser"), "location", "https://www.sie-sucht-sie.de/oesterreich/wien")
        self.assertIn("Wien.jpg", cleaned_incomplete)
        self.assertIn("Flirt &amp; Dating Statistik", cleaned_incomplete)


if __name__ == "__main__":
    unittest.main()
