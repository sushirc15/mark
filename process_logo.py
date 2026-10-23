"""
Process user uploaded image media_1792778584700.png to create a high-res, premium
circular logo with a metallic gold rim for Mashmanos.
"""
from PIL import Image, ImageDraw, ImageFilter
import os

source_path = "/Users/sushirc/.gemini/antigravity/brain/7cf409c5-5b82-4c5f-a09d-e8c59fb43724/.user_uploaded/media_1792778584700.png"
dest_path = "public/images/mashmanos_logo.png"

im = Image.open(source_path).convert("RGBA")
w, h = im.size

# The face is centered around (512, 480)
# Let's crop a square region centered on Mark's face
size = min(w, h)
left = (w - size) // 2
top = (h - size) // 2
square = im.crop((left, top, left + size, top + size))
square = square.resize((512, 512), Image.Resampling.LANCZOS)

# Create high-end circular badge with gold metallic rim
target = Image.new("RGBA", (512, 512), (0, 0, 0, 0))

# Circular mask for the face image (radius 240)
mask = Image.new("L", (512, 512), 0)
draw_mask = ImageDraw.Draw(mask)
draw_mask.ellipse((16, 16, 496, 496), fill=255)

# Paste the square image through the circular mask
target.paste(square, (0, 0), mask=mask)

# Now draw the metallic gold border and outer glow
draw = ImageDraw.Draw(target)

# Outer gold glow / ring
draw.ellipse((14, 14, 498, 498), outline="#FFE08A", width=5)
draw.ellipse((18, 18, 494, 494), outline="#F5C542", width=4)
draw.ellipse((22, 22, 490, 490), outline="#9E6D08", width=2)

target.save(dest_path, "PNG")
print(f"Saved circular logo to {dest_path}")

# Also save favicon
favicon_img = target.resize((64, 64), Image.Resampling.LANCZOS)
favicon_img.save("public/images/favicon.png", "PNG")
print("Saved favicon")
