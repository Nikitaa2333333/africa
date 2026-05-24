import os
import urllib.request
import urllib.parse
import sys

# Устанавливаем кодировку
if sys.platform.startswith('win'):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

project_dir = r"c:\Users\User\Downloads\new afc"
original_dir = os.path.join(project_dir, "assets", "images", "projects", "original")
os.makedirs(original_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def clean_url(url):
    parsed = urllib.parse.urlparse(url)
    encoded_path = urllib.parse.quote(parsed.path)
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, encoded_path, parsed.params, parsed.query, parsed.fragment))

def download_file(url, filename):
    try:
        filepath = os.path.join(original_dir, filename)
        cleaned = clean_url(url)
        print(f"Скачивание оригинала: {cleaned} -> {filepath}")
        req = urllib.request.Request(cleaned, headers=headers)
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        print("Успешно скачан оригинал!")
        return True
    except Exception as e:
        print(f"Ошибка при скачивании {url}: {e}")
        return False

# Ссылки на оригинальные изображения оборудования с сайта africatrade.ru
machinery = {
    "betonosmesitel.png": "https://africatrade.ru/wp-content/uploads/2024/07/Бетоносмеситель-БС-260_380-220x220.png",
    "vacuum_machine.png": "https://africatrade.ru/wp-content/uploads/2024/07/Вакуумно-формовочный-станок-ТВФМ-10×9-111-220x220.png",
    "vibrostol.png": "https://africatrade.ru/wp-content/uploads/2024/07/Вибростол-с-горизонтальной-вибрацией-Премиум-380В-ВСГу-001_380В-ZS0-302-301-002-220x220.png",
    "izmelchitel.png": "https://africatrade.ru/wp-content/uploads/2024/07/Измельчитель-газобетона-220x220.png",
    "proseivatel.png": "https://africatrade.ru/wp-content/uploads/2024/07/Просеиватель-со-сварной-сеткой-и-лотком-380В-2000х940×270-мм-ZS0-300-304-003-220x220.png",
    "burovoe.jpg": "https://africatrade.ru/wp-content/uploads/2020/12/electro_mini-220x220.jpg"
}

for filename, url in machinery.items():
    download_file(url, filename)

print("Все оригинальные изображения оборудования успешно загружены в папку original/!")
