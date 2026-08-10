from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

src = Path(
    r"C:\Users\spada\.cursor\projects\c-Users-spada-Projects-lukii-portfolio\assets"
    r"\c__Users_spada_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_eb7ac304-33c0-4581-af88-c36b32df2b41-c2a5c46c-66b4-480d-acc4-cb594638e8d6.png"
)
out = Path(r"C:\Users\spada\Projects\lukii-portfolio\public\lukii-ink.png")

img = Image.open(src).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]
rgb = arr[:, :, :3].astype(np.float32)
luma = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
mx = rgb.max(axis=2)
mn = rgb.min(axis=2)
sat = np.where(mx == 0, 0, (mx - mn) / (mx + 1e-6))

# Solid black studio backdrop (bird blacks are textured / not pure)
strict = (luma < 12) & (sat < 0.2)
loose = (luma < 28) & (sat < 0.25)

bg = np.zeros((h, w), dtype=bool)
q: deque[tuple[int, int]] = deque()

for x in range(w):
    for y in (0, h - 1):
        if loose[y, x]:
            bg[y, x] = True
            q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if loose[y, x] and not bg[y, x]:
            bg[y, x] = True
            q.append((y, x))

while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if not (0 <= ny < h and 0 <= nx < w) or bg[ny, nx]:
            continue
        if strict[ny, nx] or loose[ny, nx]:
            bg[ny, nx] = True
            q.append((ny, nx))

alpha = np.full((h, w), 255.0, dtype=np.float32)
alpha[bg] = 0.0

# Soften dark fringe so no hard box remains
dilated = bg.copy()
for _ in range(2):
    n = dilated.copy()
    n[1:, :] |= dilated[:-1, :]
    n[:-1, :] |= dilated[1:, :]
    n[:, 1:] |= dilated[:, :-1]
    n[:, :-1] |= dilated[:, 1:]
    dilated = n

fringe = dilated & ~bg
# Only fade near-black fringe, not red/white paint
dark = np.clip((40 - luma) / 40.0, 0.0, 1.0) * np.clip((0.3 - sat) / 0.3, 0.0, 1.0)
alpha[fringe] *= 1.0 - 0.75 * dark[fringe]

arr[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
result = Image.fromarray(arr, "RGBA")

bbox = result.getbbox()
if bbox:
    pad = 6
    left, top, right, bottom = bbox
    result = result.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(w, right + pad),
            min(h, bottom + pad),
        )
    )

max_side = 1600
if max(result.size) > max_side:
    result.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

result.save(out, "PNG", optimize=True)
a = np.array(result)
print("saved", out, "size", result.size)
print("transparent pct", round((a[:, :, 3] == 0).mean() * 100, 2))
print("corners alpha", int(a[0, 0, 3]), int(a[0, -1, 3]), int(a[-1, 0, 3]), int(a[-1, -1, 3]))
