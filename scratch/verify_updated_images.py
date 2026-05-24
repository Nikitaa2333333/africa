import os
from PIL import Image

paths = {
    "vibrostol.png": r"c:\Users\User\Downloads\new afc\assets\images\projects\vibrostol.png",
    "izmelchitel.png": r"c:\Users\User\Downloads\new afc\assets\images\projects\izmelchitel.png",
    "smesitel_aktivator.png": r"c:\Users\User\Downloads\new afc\assets\images\projects\smesitel_aktivator.png"
}

for name, p in paths.items():
    if os.path.exists(p):
        with Image.open(p) as img:
            print(f"{name}: size={img.size}, mode={img.mode}, format={img.format}")
    else:
        print(f"ERROR: {name} DOES NOT EXIST at {p}")
