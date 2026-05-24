import os
from PIL import Image

paths = [
    r"c:\Users\User\Downloads\new afc\assets\images\projects\original\vibrostol.png",
    r"c:\Users\User\Downloads\new afc\assets\images\projects\original\izmelchitel.png",
    r"c:\Users\User\Downloads\new afc\assets\images\projects\smesitel_aktivator.png"
]

for p in paths:
    if os.path.exists(p):
        with Image.open(p) as img:
            print(f"{os.path.basename(p)}: size={img.size}, mode={img.mode}, format={img.format}")
    else:
        print(f"{p} DOES NOT EXIST")
