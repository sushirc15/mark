"""
Additional partner and casino logos for Mashmanos portal
"""
import os

images_dir = os.path.join(os.path.dirname(__file__), "public", "images")
os.makedirs(images_dir, exist_ok=True)

casino_logos = {
    "shuffle_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <defs>
    <linearGradient id="shf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>
  <rect x="5" y="10" width="40" height="40" rx="8" fill="url(#shf)"/>
  <path d="M15 25 L25 35 L35 25 M15 35 L25 25 L35 35" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="56" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" letter-spacing="1">SHUFFLE</text>
  <text x="57" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="700" fill="#F5C542" letter-spacing="2">OFFICIAL PARTNER</text>
</svg>""",

    "mrq_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <rect x="5" y="10" width="40" height="40" rx="20" fill="#FFCC00"/>
  <text x="25" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#1A1033" text-anchor="middle">Q</text>
  <text x="55" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" letter-spacing="0.5">Mr Q</text>
  <text x="56" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="700" fill="#00E676" letter-spacing="1.5">NO WAGER CASINO</text>
</svg>""",

    "stake_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <rect x="5" y="10" width="40" height="40" rx="8" fill="#141E28"/>
  <path d="M25 18 C19 18 16 22 16 26 C16 32 32 30 32 36 C32 40 28 42 24 42 C19 42 16 38 16 38" fill="none" stroke="#00E701" stroke-width="4" stroke-linecap="round"/>
  <text x="56" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" letter-spacing="1">STAKE</text>
  <text x="57" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="700" fill="#00E701" letter-spacing="2">VERIFIED CRYPTO</text>
</svg>""",

    "roobet_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <rect x="5" y="10" width="40" height="40" rx="8" fill="#FFE08A"/>
  <text x="25" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#1A1033" text-anchor="middle">🦘</text>
  <text x="56" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" letter-spacing="1">ROOBET</text>
  <text x="57" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="700" fill="#F5C542" letter-spacing="2">CASINO &amp; SPORTS</text>
</svg>""",

    "coin_gold.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="cg" cx="40%" cy="35%">
      <stop offset="0%" stop-color="#FFF5C2"/>
      <stop offset="45%" stop-color="#F5C542"/>
      <stop offset="85%" stop-color="#C69214"/>
      <stop offset="100%" stop-color="#805903"/>
    </radialGradient>
    <filter id="c-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#F5C542" flood-opacity="0.4"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="44" fill="url(#cg)" stroke="#FFE08A" stroke-width="3" filter="url(#c-glow)"/>
  <circle cx="50" cy="50" r="37" fill="none" stroke="#9A6B0A" stroke-width="1.5" stroke-dasharray="3 3"/>
  <text x="50" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#724C03" text-anchor="middle">M</text>
</svg>"""
}

for filename, content in casino_logos.items():
    filepath = os.path.join(images_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())

print(f"Generated {len(casino_logos)} casino logos in {images_dir}")
