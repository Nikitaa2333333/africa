import os
from PIL import Image

artifacts_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\bd682371-fadf-4114-b98b-e46d971185c7"
files = [
    "izmelchitel_8k_1779459317954.png",
    "vibrostol_8k_1779459301218.png",
    "vibrostol_fixed_1779460566979.png",
    "vibrostol_1779458657208.png"
]

for f in files:
    p = os.path.join(artifacts_dir, f)
    if os.path.exists(p):
        with Image.open(p) as img:
            print(f"{f}: size={img.size}, mode={img.mode}")
    else:
        print(f"{f} DOES NOT EXIST")
