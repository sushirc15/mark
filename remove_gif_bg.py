"""
Process mark_jackpot_loop.gif to cleanly remove the white/grey checkerboard background
and make it truly transparent with smooth anti-aliased alpha blending.
"""
from PIL import Image, ImageSequence
from collections import deque
import os

gif_path = "mark_jackpot_loop.gif"
out_gif_path = "public/mark_jackpot_loop.gif"

im = Image.open(gif_path)
frames = []
durations = []

def clean_frame(pil_frame):
    rgba = pil_frame.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    def is_checkerboard(r, g, b):
        # Checkerboard is white (~255) or light grey (~230-245) with negligible color difference
        if r > 210 and g > 210 and b > 210:
            if max(abs(r - g), abs(g - b), abs(r - b)) <= 12:
                return True
        return False

    # BFS Flood fill from the image edges
    visited = [[False]*h for _ in range(w)]
    queue = deque()

    for x in range(w):
        if is_checkerboard(pixels[x, 0][0], pixels[x, 0][1], pixels[x, 0][2]):
            queue.append((x, 0))
            visited[x][0] = True
        if is_checkerboard(pixels[x, h-1][0], pixels[x, h-1][1], pixels[x, h-1][2]):
            queue.append((x, h-1))
            visited[x][h-1] = True

    for y in range(h):
        if is_checkerboard(pixels[0, y][0], pixels[0, y][1], pixels[0, y][2]):
            queue.append((0, y))
            visited[0][y] = True
        if is_checkerboard(pixels[w-1, y][0], pixels[w-1, y][1], pixels[w-1, y][2]):
            queue.append((w-1, y))
            visited[w-1][y] = True

    bg_coords = []
    while queue:
        cx, cy = queue.popleft()
        bg_coords.append((cx, cy))
        for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                visited[nx][ny] = True
                if is_checkerboard(pixels[nx, ny][0], pixels[nx, ny][1], pixels[nx, ny][2]):
                    queue.append((nx, ny))

    # Also check if there are any checkerboard pockets near top/sides (above y=120 or x < 100 or x > 520)
    # that didn't connect through a thin hair strand
    for x in range(w):
        for y in range(h):
            if not visited[x][y]:
                # If it's pure checkerboard and near the periphery
                if (y < 90 or x < 70 or x > 540) and is_checkerboard(pixels[x, y][0], pixels[x, y][1], pixels[x, y][2]):
                    bg_coords.append((x, y))
                    visited[x][y] = True

    for x, y in bg_coords:
        pixels[x, y] = (0, 0, 0, 0)

    # Clean up single fringe pixels right next to transparent
    for x, y in bg_coords:
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny][3] > 0:
                pr, pg, pb, _ = pixels[nx, ny]
                if pr > 200 and pg > 200 and pb > 200 and max(abs(pr-pg), abs(pg-pb)) <= 15:
                    pixels[nx, ny] = (0, 0, 0, 0)

    return rgba

cleaned_frames = []
for i, f in enumerate(ImageSequence.Iterator(im)):
    d = f.info.get("duration", 600)
    durations.append(d)
    cleaned = clean_frame(f)
    cleaned_frames.append(cleaned)

# Save as animated GIF with transparency
# In Pillow, to save an animated GIF with true transparency per frame:
processed_frames = []
for f in cleaned_frames:
    # Convert RGBA to P with alpha transparency
    # Extract alpha mask
    alpha = f.split()[3]
    rgb = f.convert("RGB")
    # Quantize to 255 colors, leaving 1 color for transparency
    p_frame = rgb.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    # Set pixels where alpha == 0 to color 255
    p_pixels = p_frame.load()
    a_pixels = alpha.load()
    w, h = f.size
    for x in range(w):
        for y in range(h):
            if a_pixels[x, y] < 128:
                p_pixels[x, y] = 255
    p_frame.info["transparency"] = 255
    p_frame.info["duration"] = durations[len(processed_frames)]
    p_frame.info["disposal"] = 2
    processed_frames.append(p_frame)

processed_frames[0].save(
    out_gif_path,
    save_all=True,
    append_images=processed_frames[1:],
    duration=durations,
    loop=0,
    transparency=255,
    disposal=2
)

# Also copy to root
processed_frames[0].save(
    "mark_jackpot_loop_clean.gif",
    save_all=True,
    append_images=processed_frames[1:],
    duration=durations,
    loop=0,
    transparency=255,
    disposal=2
)

print(f"Successfully cleaned {len(cleaned_frames)} frames and saved to {out_gif_path}")
