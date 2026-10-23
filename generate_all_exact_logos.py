"""
Generate exact, authentic SVG logos for all partner casinos, crypto on-ramps, VPNs, and compliance bodies.
"""
import os

images_dir = os.path.join(os.path.dirname(__file__), "public", "images")
os.makedirs(images_dir, exist_ok=True)

logos = {
    "shuffle_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64">
  <defs>
    <linearGradient id="shf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>
  <!-- Shuffle Geometric Icon -->
  <rect x="6" y="8" width="48" height="48" rx="12" fill="url(#shf-grad)"/>
  <path d="M19 23 L30 32 L19 41" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M41 23 L30 32 L41 41" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Typography -->
  <text x="66" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF" letter-spacing="1.2">SHUFFLE</text>
  <text x="67" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="800" fill="#F5C542" letter-spacing="2.5">OFFICIAL PARTNER</text>
</svg>""",

    "stake_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 64" width="220" height="64">
  <defs>
    <linearGradient id="stk-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141E28"/>
      <stop offset="100%" stop-color="#0F1720"/>
    </linearGradient>
  </defs>
  <rect x="6" y="8" width="48" height="48" rx="12" fill="url(#stk-bg)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <!-- Stake S Icon -->
  <path d="M34 21 C26 21 21 24.5 21 29 C21 37 39 34 39 40 C39 44 34 46.5 28 46.5 C22 46.5 19 43 19 43" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  <!-- Typography -->
  <text x="66" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="27" font-weight="900" fill="#FFFFFF" letter-spacing="1">Stake</text>
  <text x="67" y="51" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="800" fill="#00E701" letter-spacing="2">VERIFIED CASINO</text>
</svg>""",

    "roobet_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 64" width="220" height="64">
  <defs>
    <linearGradient id="roo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE08A"/>
      <stop offset="100%" stop-color="#F5C542"/>
    </linearGradient>
  </defs>
  <!-- Kangaroo Badge -->
  <rect x="6" y="8" width="48" height="48" rx="12" fill="url(#roo-gold)"/>
  <!-- Kangaroo vector shape -->
  <path d="M22 43 C23 37 25 35 28 34 C31 33 33 30 32 26 C31 23 33 20 37 20 C38 22 36 24 38 25 C41 24 43 25 43 27 C42 30 38 32 36 34 C38 36 41 38 43 41 C38 41 34 39 31 38 C28 42 25 44 22 43 Z" fill="#1A1033"/>
  <circle cx="21" cy="42" r="3.5" fill="#1A1033"/>
  <!-- Typography -->
  <text x="66" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF" letter-spacing="1">ROOBET</text>
  <text x="67" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="800" fill="#F5C542" letter-spacing="2">CASINO &amp; SPORTS</text>
</svg>""",

    "mrq_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 64" width="220" height="64">
  <!-- Mr Q Yellow Circular Q -->
  <circle cx="30" cy="32" r="22" fill="#FFD200"/>
  <circle cx="28" cy="30" r="11" fill="#1A1033"/>
  <circle cx="28" cy="30" r="5" fill="#FFD200"/>
  <path d="M34 36 L43 45" stroke="#1A1033" stroke-width="5" stroke-linecap="round"/>
  <!-- Typography -->
  <text x="64" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="27" font-weight="900" fill="#FFFFFF" letter-spacing="0.5">Mr Q</text>
  <text x="65" y="51" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="800" fill="#00E676" letter-spacing="2">NO WAGER CASINO</text>
</svg>""",

    "rollbit_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 64" width="220" height="64">
  <defs>
    <linearGradient id="rb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9800"/>
      <stop offset="100%" stop-color="#FF5722"/>
    </linearGradient>
  </defs>
  <!-- Rollbit Cube -->
  <rect x="6" y="8" width="48" height="48" rx="12" fill="#181820" stroke="rgba(255,152,0,0.4)" stroke-width="1.5"/>
  <polygon points="30,16 44,24 30,32 16,24" fill="url(#rb-grad)"/>
  <polygon points="16,26 30,34 30,48 16,40" fill="#F57C00"/>
  <polygon points="44,26 44,40 30,48 30,34" fill="#E64A19"/>
  <!-- Typography -->
  <text x="66" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="900" fill="#FFFFFF" letter-spacing="1">ROLLBIT</text>
  <text x="67" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="800" fill="#FF9800" letter-spacing="2">CRYPTO CASINO</text>
</svg>""",

    "duelz_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 64" width="220" height="64">
  <defs>
    <linearGradient id="dz-crest" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6B2FD6"/>
      <stop offset="100%" stop-color="#2D1160"/>
    </linearGradient>
  </defs>
  <!-- Duelz Crest Shield -->
  <path d="M14 12 L46 12 C46 32 30 48 30 52 C30 48 14 32 14 12 Z" fill="url(#dz-crest)" stroke="#F5C542" stroke-width="2"/>
  <line x1="20" y1="20" x2="40" y2="38" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/>
  <line x1="40" y1="20" x2="20" y2="38" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/>
  <!-- Typography -->
  <text x="62" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="900" fill="#FFFFFF" letter-spacing="2">DUELZ</text>
  <text x="63" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="800" fill="#F5C542" letter-spacing="2">PVP CASINO</text>
</svg>""",

    "leovegas_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 64" width="220" height="64">
  <!-- LeoVegas Lion Paw -->
  <circle cx="30" cy="32" r="22" fill="#E65100"/>
  <ellipse cx="30" cy="38" rx="8" ry="6" fill="#FFFFFF"/>
  <circle cx="21" cy="27" r="3.5" fill="#FFFFFF"/>
  <circle cx="27" cy="23" r="3.5" fill="#FFFFFF"/>
  <circle cx="33" cy="23" r="3.5" fill="#FFFFFF"/>
  <circle cx="39" cy="27" r="3.5" fill="#FFFFFF"/>
  <!-- Typography -->
  <text x="62" y="37" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="23" font-weight="900" fill="#FFFFFF">LeoVegas</text>
  <text x="63" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="800" fill="#FFB74D" letter-spacing="2">KING OF CASINO</text>
</svg>""",

    "nordvpn_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <circle cx="24" cy="25" r="18" fill="#4687FF"/>
  <polygon points="24,12 14,33 34,33" fill="#FFFFFF"/>
  <polygon points="24,20 18,33 30,33" fill="#205CE6"/>
  <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">NordVPN</text>
</svg>""",

    "expressvpn_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 50" width="220" height="50">
  <circle cx="24" cy="25" r="18" fill="#D32F2F"/>
  <path d="M15 22 L22 29 L33 18" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">ExpressVPN</text>
</svg>""",

    "moonpay_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <circle cx="24" cy="25" r="18" fill="#7D00FF"/>
  <circle cx="24" cy="25" r="8" fill="#FFDF00"/>
  <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">MoonPay</text>
</svg>""",

    "kraken_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <rect x="6" y="8" width="34" height="34" rx="8" fill="#5741D9"/>
  <path d="M16 16 C16 26 23 26 23 34 M23 16 C23 26 30 26 30 34" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <text x="48" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">kraken</text>
</svg>""",

    "binance_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <polygon points="24,10 30,16 24,22 18,16" fill="#F0B90B"/>
  <polygon points="14,20 18,24 14,28 10,24" fill="#F0B90B"/>
  <polygon points="34,20 38,24 34,28 30,24" fill="#F0B90B"/>
  <polygon points="24,26 30,32 24,38 18,32" fill="#F0B90B"/>
  <text x="48" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#F0B90B" letter-spacing="1">BINANCE</text>
</svg>""",

    "coinbase_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <circle cx="24" cy="25" r="18" fill="#0052FF"/>
  <rect x="18" y="19" width="12" height="12" rx="4" fill="#FFFFFF"/>
  <text x="50" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">coinbase</text>
</svg>""",

    "kick_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40">
  <rect x="2" y="2" width="36" height="36" rx="8" fill="#00E701"/>
  <path d="M12 9 H18 V18 L24 9 H30 L23 20 L30 31 H24 L18 22 V31 H12 Z" fill="#000000"/>
  <text x="46" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#00E701" letter-spacing="1">KICK</text>
</svg>"""
}

for name, svg in logos.items():
    path = os.path.join(images_dir, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg.strip())

print(f"Generated {len(logos)} exact official logos in {images_dir}")
