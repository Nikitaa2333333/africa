import os

def find_files():
    search_dirs = [
        r"C:\Users\User\.gemini\antigravity-ide",
        r"C:\Users\User\Downloads"
    ]
    for d in search_dirs:
        print(f"Searching in {d}...")
        for root, dirs, files in os.walk(d):
            # Пропускаем некоторые тяжелые системные папки, если нужно
            if ".git" in root or "node_modules" in root:
                continue
            for f in files:
                if "smesitel" in f.lower():
                    print(os.path.join(root, f))

if __name__ == "__main__":
    find_files()
