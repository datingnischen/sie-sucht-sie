import unittest
from bs4 import BeautifulSoup
from scripts.import_public_pages import clean_content, safe_href


class ImportSecurityTests(unittest.TestCase):
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
        self.assertIn('href="https://www.sie-sucht-sie.de/registration?AID=location"', cleaned)
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


if __name__ == "__main__":
    unittest.main()
