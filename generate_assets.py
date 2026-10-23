"""
Asset generator for Mashmanos Casino Portal
Generates crisp, branded SVG artwork for slots and casino partners
"""
import os

images_dir = os.path.join(os.path.dirname(__file__), "public", "images")
os.makedirs(images_dir, exist_ok=True)

slots_artwork = {
    "gates_of_olympus.svg": {
        "title": "GATES OF OLYMPUS",
        "subtitle": "PRAGMATIC PLAY",
        "bg_gradient": ("#1E0A3C", "#4A1B8C"),
        "accent": "#F5C542",
        "icon": """
            <circle cx="150" cy="90" r="42" fill="url(#zeus-glow)" stroke="#F5C542" stroke-width="3"/>
            <path d="M150 62 L158 84 L180 84 L162 98 L168 120 L150 106 L132 120 L138 98 L120 84 L142 84 Z" fill="#F5C542"/>
            <path d="M142 125 L156 125 L145 145 L158 145 L135 175 L143 152 L132 152 Z" fill="#FFE08A"/>
        """
    },
    "sweet_bonanza.svg": {
        "title": "SWEET BONANZA",
        "subtitle": "PRAGMATIC PLAY",
        "bg_gradient": ("#380036", "#0CBABA"),
        "accent": "#FF4D8D",
        "icon": """
            <circle cx="150" cy="95" r="45" fill="#FF2A7A" stroke="#FFF" stroke-width="4"/>
            <path d="M125 95 C125 75 140 60 150 60 C165 60 175 75 175 95 C175 115 160 130 150 130 C135 130 125 115 125 95" fill="none" stroke="#FFE08A" stroke-width="7" stroke-linecap="round"/>
            <circle cx="150" cy="95" r="10" fill="#FFF"/>
            <rect x="146" y="140" width="8" height="40" rx="4" fill="#FFF"/>
        """
    },
    "wanted_dead.svg": {
        "title": "WANTED DEAD OR A WILD",
        "subtitle": "HACKSAW GAMING",
        "bg_gradient": ("#140700", "#3D1400"),
        "accent": "#E65100",
        "icon": """
            <rect x="90" y="45" width="120" height="95" rx="6" fill="#D7CCC8" stroke="#5D4037" stroke-width="3"/>
            <text x="150" y="70" font-family="Impact, sans-serif" font-size="16" fill="#3E2723" text-anchor="middle" font-weight="bold">WANTED</text>
            <circle cx="150" cy="100" r="18" fill="#5D4037"/>
            <circle cx="143" cy="96" r="3" fill="#FFF"/>
            <circle cx="157" cy="96" r="3" fill="#FFF"/>
            <text x="150" y="130" font-family="monospace" font-size="12" fill="#B71C1C" text-anchor="middle" font-weight="bold">$100,000</text>
        """
    },
    "sugar_rush.svg": {
        "title": "SUGAR RUSH 1000",
        "subtitle": "PRAGMATIC PLAY",
        "bg_gradient": ("#2B0938", "#6B117A"),
        "accent": "#FF6FD8",
        "icon": """
            <circle cx="150" cy="85" r="32" fill="#FF5252" stroke="#FFE08A" stroke-width="3"/>
            <circle cx="120" cy="120" r="22" fill="#FFD740"/>
            <circle cx="180" cy="120" r="22" fill="#69F0AE"/>
            <circle cx="150" cy="130" r="20" fill="#E040FB"/>
            <text x="150" y="93" font-family="sans-serif" font-size="20" fill="#FFF" font-weight="900" text-anchor="middle">1000x</text>
        """
    },
    "rip_city.svg": {
        "title": "RIP CITY",
        "subtitle": "HACKSAW GAMING",
        "bg_gradient": ("#121217", "#2D2D3A"),
        "accent": "#00E5FF",
        "icon": """
            <circle cx="150" cy="95" r="42" fill="#1E1E24" stroke="#00E5FF" stroke-width="3"/>
            <path d="M125 75 L135 60 L145 75 Z" fill="#00E5FF"/>
            <path d="M155 75 L165 60 L175 75 Z" fill="#00E5FF"/>
            <ellipse cx="138" cy="92" rx="7" ry="10" fill="#FFF"/>
            <ellipse cx="162" cy="92" rx="7" ry="10" fill="#FFF"/>
            <circle cx="138" cy="92" r="4" fill="#000"/>
            <circle cx="162" cy="92" r="4" fill="#000"/>
            <path d="M135 115 Q150 130 165 115" stroke="#00E5FF" stroke-width="4" fill="none" stroke-linecap="round"/>
        """
    },
    "san_quentin.svg": {
        "title": "SAN QUENTIN xWAYS",
        "subtitle": "NOLIMIT CITY",
        "bg_gradient": ("#1C1605", "#3A2E00"),
        "accent": "#FFD600",
        "icon": """
            <rect x="90" y="55" width="120" height="80" rx="4" fill="#212121" stroke="#FFD600" stroke-width="2"/>
            <line x1="110" y1="55" x2="110" y2="135" stroke="#757575" stroke-width="3"/>
            <line x1="130" y1="55" x2="130" y2="135" stroke="#757575" stroke-width="3"/>
            <line x1="150" y1="55" x2="150" y2="135" stroke="#757575" stroke-width="3"/>
            <line x1="170" y1="55" x2="170" y2="135" stroke="#757575" stroke-width="3"/>
            <line x1="190" y1="55" x2="190" y2="135" stroke="#757575" stroke-width="3"/>
            <rect x="100" y="85" width="100" height="25" fill="#D50000"/>
            <text x="150" y="103" font-family="Impact, sans-serif" font-size="14" fill="#FFF" text-anchor="middle" letter-spacing="2">LOCKDOWN</text>
        """
    },
    "mental.svg": {
        "title": "MENTAL",
        "subtitle": "NOLIMIT CITY",
        "bg_gradient": ("#0F0F12", "#2B161B"),
        "accent": "#D32F2F",
        "icon": """
            <circle cx="150" cy="95" r="44" fill="#1C1417" stroke="#D32F2F" stroke-width="2"/>
            <path d="M130 80 Q150 60 170 80 Q150 120 130 80" fill="none" stroke="#D32F2F" stroke-width="3"/>
            <circle cx="150" cy="85" r="8" fill="#D32F2F"/>
            <text x="150" y="125" font-family="Courier, monospace" font-size="14" fill="#E0E0E0" text-anchor="middle">66,666x</text>
        """
    },
    "chaos_crew.svg": {
        "title": "CHAOS CREW 2",
        "subtitle": "HACKSAW GAMING",
        "bg_gradient": ("#0D1117", "#1E2738"),
        "accent": "#00FF66",
        "icon": """
            <circle cx="150" cy="95" r="42" fill="#111" stroke="#00FF66" stroke-width="3"/>
            <text x="135" y="95" font-family="Impact, sans-serif" font-size="28" fill="#FF0055">X</text>
            <text x="160" y="95" font-family="Impact, sans-serif" font-size="28" fill="#00FF66">X</text>
            <path d="M130 115 Q150 135 170 115" stroke="#FFCC00" stroke-width="4" fill="none"/>
        """
    },
    "dork_unit.svg": {
        "title": "DORK UNIT",
        "subtitle": "HACKSAW GAMING",
        "bg_gradient": ("#1E0F38", "#451B69"),
        "accent": "#FFE08A",
        "icon": """
            <rect x="110" y="65" width="80" height="70" rx="8" fill="#6B2FD6" stroke="#FFE08A" stroke-width="3"/>
            <rect x="145" y="65" width="10" height="70" fill="#FFE08A"/>
            <rect x="110" y="95" width="80" height="10" fill="#FFE08A"/>
            <circle cx="150" cy="65" r="12" fill="#FF4081"/>
        """
    },
    "big_bamboo.svg": {
        "title": "BIG BAMBOO",
        "subtitle": "PUSH GAMING",
        "bg_gradient": ("#061E14", "#0D3D2A"),
        "accent": "#00E676",
        "icon": """
            <rect x="120" y="50" width="12" height="90" rx="3" fill="#00E676"/>
            <rect x="144" y="40" width="12" height="100" rx="3" fill="#69F0AE"/>
            <rect x="168" y="55" width="12" height="85" rx="3" fill="#00E676"/>
            <circle cx="150" cy="115" r="22" fill="#FFF"/>
            <circle cx="142" cy="112" r="5" fill="#000"/>
            <circle cx="158" cy="112" r="5" fill="#000"/>
        """
    },
    "ze_zeus.svg": {
        "title": "ZE ZEUS",
        "subtitle": "HACKSAW GAMING",
        "bg_gradient": ("#0F172A", "#1E293B"),
        "accent": "#38BDF8",
        "icon": """
            <polygon points="150,45 165,85 155,85 170,125 140,125 148,95 135,95" fill="#38BDF8" stroke="#FFF" stroke-width="1.5"/>
            <circle cx="150" cy="95" r="45" fill="none" stroke="#38BDF8" stroke-dasharray="4 4" stroke-width="2"/>
        """
    },
    "razor_returns.svg": {
        "title": "RAZOR RETURNS",
        "subtitle": "PUSH GAMING",
        "bg_gradient": ("#071A2E", "#0F3460"),
        "accent": "#00D2FF",
        "icon": """
            <path d="M110 120 C120 70 150 65 190 90 C170 120 130 130 110 120 Z" fill="#37474F" stroke="#00D2FF" stroke-width="2"/>
            <polygon points="145,65 160,40 165,65" fill="#00D2FF"/>
            <circle cx="170" cy="85" r="4" fill="#FF1744"/>
            <path d="M150 100 L160 95 L170 100" stroke="#FFF" stroke-width="2"/>
        """
    }
}

for filename, data in slots_artwork.items():
    svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 190" width="300" height="190">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{data['bg_gradient'][0]}"/>
      <stop offset="100%" stop-color="{data['bg_gradient'][1]}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5C542"/>
      <stop offset="100%" stop-color="#FFE08A"/>
    </linearGradient>
    <radialGradient id="zeus-glow">
      <stop offset="0%" stop-color="#FFE08A" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#F5C542" stop-opacity="0.1"/>
    </radialGradient>
    <linearGradient id="panel-glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.1)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="300" height="190" fill="url(#bg)"/>
  <rect width="300" height="190" fill="url(#panel-glow)"/>

  <!-- Icon Artwork -->
  {data['icon']}

  <!-- Footer Banner -->
  <rect y="142" width="300" height="48" fill="#0B0B12" fill-opacity="0.88"/>
  <line x1="0" y1="142" x2="300" y2="142" stroke="#6B2FD6" stroke-width="1.5" stroke-opacity="0.6"/>

  <!-- Texts -->
  <text x="150" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">{data['title']}</text>
  <text x="150" y="179" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#F5C542" text-anchor="middle" letter-spacing="1.2">{data['subtitle']}</text>
</svg>"""
    filepath = os.path.join(images_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(svg_code.strip())

print(f"Generated {len(slots_artwork)} slot images in {images_dir}")
