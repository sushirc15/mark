"""
Self-test script for Mashmanos backend logic and data consistency
"""
import json
import os
import unittest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")

class TestMashmanosPortal(unittest.TestCase):
    def setUp(self):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    def test_data_integrity(self):
        self.assertIn("stream_status", self.data)
        self.assertIn("voting_status", self.data)
        self.assertIn("slots", self.data)
        self.assertIn("featured_offers", self.data)
        self.assertIn("leaderboards", self.data)
        self.assertIn("bonus_hunts", self.data)

    def test_slots_catalogue(self):
        slots = self.data["slots"]
        self.assertGreaterEqual(len(slots), 8)
        for s in slots:
            self.assertIn("id", s)
            self.assertIn("name", s)
            self.assertIn("provider", s)
            self.assertIn("votes", s)
            self.assertIn("image", s)

    def test_featured_offers(self):
        offers = self.data["featured_offers"]
        self.assertIn("crypto", offers)
        self.assertIn("traditional", offers)
        self.assertEqual(offers["crypto"]["name"], "Shuffle")
        self.assertEqual(offers["traditional"]["name"], "Mr Q Casino")

    def test_leaderboard_sponsors(self):
        lbs = self.data["leaderboards"]
        self.assertIn("shuffle", lbs)
        self.assertIn("stake", lbs)
        self.assertIn("roobet", lbs)
        for name, lb in lbs.items():
            self.assertGreaterEqual(len(lb["entries"]), 10)
            self.assertIn("prize_pool", lb)

    def test_hero_gif_exists(self):
        gif_path = os.path.join(BASE_DIR, "public", "mark_jackpot_loop.gif")
        self.assertTrue(os.path.exists(gif_path))
        self.assertGreater(os.path.getsize(gif_path), 500000)

    def test_transparent_gif_and_brand_logo(self):
        trans_gif = os.path.join(BASE_DIR, "public", "mark_jackpot_transparent.gif")
        self.assertTrue(os.path.exists(trans_gif))
        self.assertGreater(os.path.getsize(trans_gif), 10000)

        brand_logo = os.path.join(BASE_DIR, "public", "images", "mashmanos_logo.png")
        self.assertTrue(os.path.exists(brand_logo))
        self.assertGreater(os.path.getsize(brand_logo), 5000)

    def test_casino_vector_logos(self):
        logos = [
            "shuffle_logo.svg", "stake_logo.svg", "roobet_logo.svg",
            "mrq_logo.svg", "rollbit_logo.svg", "duelz_logo.svg",
            "leovegas_logo.svg", "kick_logo.svg"
        ]
        for logo in logos:
            p = os.path.join(BASE_DIR, "public", "images", logo)
            self.assertTrue(os.path.exists(p), f"Missing logo: {logo}")
            self.assertGreater(os.path.getsize(p), 100)

    def test_social_vector_logos(self):
        logos = [
            "kick_logo.svg", "youtube_logo.svg", "x_logo.svg",
            "discord_logo.svg", "telegram_logo.svg", "instagram_logo.svg"
        ]
        for logo in logos:
            p = os.path.join(BASE_DIR, "public", "images", logo)
            self.assertTrue(os.path.exists(p), f"Missing social logo: {logo}")
            self.assertGreater(os.path.getsize(p), 100)

    def test_frontend_features(self):
        with open(os.path.join(BASE_DIR, "public", "index.html"), "r") as f:
            html = f.read()
            self.assertIn("fireworks-canvas", html)
            self.assertIn("mark_jackpot_transparent.gif", html)
            self.assertIn("mashmanos_logo.png", html)
            self.assertIn('data-route="socials"', html)
            self.assertIn('id="section-socials"', html)
            self.assertNotIn('data-route="youtube"', html)

        with open(os.path.join(BASE_DIR, "public", "styles.css"), "r") as f:
            css = f.read()
            self.assertIn("lb-podium-container", css)
            self.assertIn("podium-pillar", css)
            self.assertIn("gold-stand", css)
            self.assertIn("fireworks-canvas", css)
            self.assertIn("btn-gold", css)
            self.assertIn("social-showcase-card", css)

        with open(os.path.join(BASE_DIR, "public", "app.js"), "r") as f:
            js = f.read()
            self.assertIn("initFireworks", js)
            self.assertIn("lb-podium-container", js)
            self.assertIn("window.renderLeaderboard", js)
            self.assertIn("'socials'", js)

if __name__ == "__main__":
    unittest.main()
