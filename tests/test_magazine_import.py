import unittest
from scripts.import_magazine import (
    _extension,
    _prepare_media,
    _valid_signature,
    localize_public_page_value,
    sanitize_magazine_html,
)
from scripts.safe_fetch import FetchPolicyError

SOURCE = "https://www.sie-sucht-sie.de/magazin/example/"


class MagazineImportTests(unittest.TestCase):
    def test_sanitizer_localizes_media_and_preserves_safe_editorial_structure(self):
        media = "https://www.sie-sucht-sie.de/magazin/wp-content/uploads/2026/07/photo.jpg"
        html = f"""
        <div style="color:red" onclick="alert(1)">
          <h2 id="intro">Ein guter Einstieg</h2>
          <p>Text mit <strong>Betonung</strong>.</p>
          <img src="{media}" srcset="{media} 2x" alt="Editorial">
          <table><tbody><tr><th>Frage</th><td>Antwort</td></tr></tbody></table>
          <script>alert(1)</script><form><input name="private"></form>
        </div>
        """
        cleaned = sanitize_magazine_html(html, SOURCE, {media: "/magazine/media/photo.jpg"})
        self.assertIn('<h2 id="intro">Ein guter Einstieg</h2>', cleaned)
        self.assertIn('<img alt="Editorial" loading="lazy" src="/magazine/media/photo.jpg"/>', cleaned)
        self.assertIn("<table>", cleaned)
        for forbidden in ("style=", "onclick", "srcset", "<script", "<form", "<input"):
            self.assertNotIn(forbidden, cleaned.lower())

    def test_sanitizer_normalizes_internal_links(self):
        html = """
        <p><a href="https://www.sie-sucht-sie.de/magazin/coming-out/">Coming-out</a></p>
        <p><a href="https://sie-sucht-sie.de/lexikon/">Lexikon</a></p>
        <p><a href="/registration">Jetzt registrieren</a></p>
        <p><a href="https://example.org/source">Quelle</a></p>
        <p><a href="javascript:alert(1)">Unsicher</a></p>
        <p><a href="https://www.sie-sucht-sie.de/magazin/szenebars-berlin/">Berlin</a></p>
        """
        cleaned = sanitize_magazine_html(html, SOURCE, {})
        self.assertIn('href="/magazin/coming-out"', cleaned)
        self.assertIn('href="/lexikon"', cleaned)
        self.assertIn('href="https://www.sie-sucht-sie.de/registration/?AID=magazin"', cleaned)
        self.assertIn('href="https://example.org/source" rel="nofollow noopener noreferrer" target="_blank"', cleaned)
        self.assertNotIn("javascript:", cleaned)
        self.assertIn('href="/magazin/lesbische-szenebars-in-berlin"', cleaned)

    def test_sanitizer_unwraps_links_to_retired_ads_and_unbuilt_archives(self):
        html = """
        <p><a href="https://www.sie-sucht-sie.de/magazin/kontaktanzeige-angie/">Angie</a></p>
        <p><a href="/magazin/schlagwort/kontaktanzeigen-bayern/">Bayern</a></p>
        <p><a href="https://www.sie-sucht-sie.de/magazin/2019/">2019</a></p>
        <p><a href="https://www.sie-sucht-sie.de/magazin/kategorie/kontaktanzeigen/">Anzeigen</a></p>
        <p><a href="https://www.sie-sucht-sie.de/magazin/kategorie/ratgeber/">Ratgeber</a></p>
        """
        cleaned = sanitize_magazine_html(html, SOURCE, {}, frozenset({"/magazin/kontaktanzeige-angie"}))
        for text in ("Angie", "Bayern", "2019", "Anzeigen"):
            self.assertIn(f"<p>{text}</p>", cleaned)
        self.assertNotIn("kontaktanzeige-angie", cleaned)
        self.assertNotIn("schlagwort", cleaned)
        self.assertIn('href="/magazin/kategorie/ratgeber"', cleaned)

    def test_sanitizer_turns_youtube_iframes_into_safe_links(self):
        html = """
        <iframe src="https://www.youtube.com/embed/abc123"></iframe>
        <iframe src="https://embed.gettyimages.com/embed/123"></iframe>
        """
        cleaned = sanitize_magazine_html(html, SOURCE, {})
        self.assertNotIn("<iframe", cleaned)
        self.assertIn('href="https://www.youtube.com/watch?v=abc123"', cleaned)
        self.assertNotIn("embed.gettyimages.com", cleaned)

    def test_sanitizer_fails_closed_for_unlocalized_or_member_media(self):
        html = """
        <img src="https://www.sie-sucht-sie.de/magazin/wp-content/uploads/missing.jpg" alt="missing">
        <img src="https://cdn3.icony-hosting.de/user-media/member.jpg" alt="member">
        <img src="https://www.facebook.com/tr?id=1" alt="pixel">
        <audio controls><source src="https://www.sie-sucht-sie.de/magazin/wp-content/uploads/missing.mp3" type="audio/mpeg"></audio>
        """
        cleaned = sanitize_magazine_html(html, SOURCE, {})
        self.assertNotIn("<img", cleaned)
        self.assertNotIn("<audio", cleaned)
        self.assertNotIn("user-media", cleaned)

    def test_signatures(self):
        self.assertFalse(_valid_signature(b"RIFF\x04\x00\x00\x00WAVEpayload", "image/webp"))
        self.assertTrue(_valid_signature(b"RIFF\x04\x00\x00\x00WEBPpayload", "image/webp"))
        self.assertTrue(_valid_signature(b"%PDF-1.4 payload", "application/pdf"))
        self.assertFalse(_valid_signature(b"<html>", "application/pdf"))

    def test_media_extension_is_derived_from_validated_mime_type(self):
        self.assertEqual(_extension("https://example.test/file.html", "image/jpeg"), ".jpg")
        self.assertEqual(_extension("https://example.test/file.bin", "application/pdf"), ".pdf")
        with self.assertRaises(FetchPolicyError):
            _extension("https://example.test/file.exe", "application/x-msdownload")

    def test_media_manifest_rejects_unsafe_remote_slugs(self):
        base = {
            "id": 2000,
            "mime_type": "image/jpeg",
            "source_url": "https://www.sie-sucht-sie.de/magazin/wp-content/uploads/2026/08/safe.jpg",
            "media_details": {},
        }
        for slug in ("../../outside", r"..\..\outside", "/absolute", "C:-outside", "", "%2e%2e/outside"):
            with self.subTest(slug=slug), self.assertRaises(FetchPolicyError):
                _prepare_media([{**base, "slug": slug}])
        prepared, _, _ = _prepare_media([{**base, "slug": "safe_slug-1280"}])
        self.assertEqual(prepared[2000]["filename"], "2000-safe_slug-1280.jpg")

    def test_media_filenames_stay_short_for_windows_checkouts(self):
        item = {
            "id": 3792,
            "slug": "spring-happiness-and-celebration-concept-close-up-portrait-of-charming-smiling-lovely-blond-girl",
            "mime_type": "image/jpeg",
            "source_url": "https://www.sie-sucht-sie.de/magazin/wp-content/uploads/2024/09/x.jpg",
            "media_details": {},
        }
        prepared, _, _ = _prepare_media([item])
        filename = prepared[3792]["filename"]
        self.assertLessEqual(len(filename), 90)
        self.assertRegex(filename, r"^3792-spring-happiness-[a-z0-9_-]*[a-z0-9]\.jpg$")

    def test_media_manifest_reduces_percent_encoded_slugs_to_ascii(self):
        item = {
            "id": 3872,
            "slug": "%d0%b5%d0%ba%d1%80%d0%b0%d0%bd-%d1%81%d0%bd_18-9-2024_11741_www-freepik-com",
            "mime_type": "image/jpeg",
            "source_url": "https://www.sie-sucht-sie.de/magazin/wp-content/uploads/2024/09/x.jpg",
            "media_details": {},
        }
        prepared, _, _ = _prepare_media([item])
        self.assertEqual(prepared[3872]["filename"], "3872-18-9-2024_11741_www-freepik-com.jpg")

    def test_public_pages_are_pointed_at_migrated_magazine_routes(self):
        value = (
            '<a href="https://www.sie-sucht-sie.de/magazin/queer/">Queer</a>'
            '<a href="https://www.sie-sucht-sie.de/magazin">Magazin</a>'
            '<a href="https://www.sie-sucht-sie.de/magazin/szenebars-berlin">Berlin</a>'
            '<a href="https://www.sie-sucht-sie.de/magazin/unbekannt/">Unbekannt</a>'
            '<img src="https://www.sie-sucht-sie.de/magazin/wp-content/uploads/2026/07/a.png">'
        )
        localized = localize_public_page_value(
            value,
            {"/magazin/queer", "/magazin/lesbische-szenebars-in-berlin"},
            {"https://www.sie-sucht-sie.de/magazin/wp-content/uploads/2026/07/a.png": "/magazine/media/1-a.png"},
        )
        self.assertIn('href="/magazin/queer"', localized)
        self.assertIn('href="/magazin"', localized)
        self.assertIn('href="/magazin/lesbische-szenebars-in-berlin"', localized)
        self.assertIn('href="https://www.sie-sucht-sie.de/magazin/unbekannt/"', localized)
        self.assertIn('src="/magazine/media/1-a.png"', localized)


if __name__ == "__main__":
    unittest.main()
