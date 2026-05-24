import shutil
import os

# Пути
source_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\bd682371-fadf-4114-b98b-e46d971185c7"
target_dir = r"c:\Users\User\Downloads\new afc\assets\images\projects"

# Соответствия файлов (сгенерированное имя -> целевое имя)
images_map = {
    # Улучшенное оборудование на основе оригиналов
    "betonosmesitel_8k_1779459270975.png": "betonosmesitel.png",
    "vacuum_machine_8k_1779459286118.png": "vacuum_machine.png",
    "proseivatel_8k_1779459334373.png": "proseivatel.png",
    "burovoe_8k_1779459350472.png": "burovoe.png",
    
    # Сгенерированные строительные материалы
    "doors_1779458725622.png": "doors.png",
    "windows_1779458741101.png": "windows.png",
    "foam_glue_1779458758782.png": "foam_glue.png",
    "additives_1779458775433.png": "additives.png",
}

# Создаем целевую директорию, если её нет
os.makedirs(target_dir, exist_ok=True)

# Копируем файлы
print("Копирование улучшенных (8K) изображений оборудования и материалов...")
for src_name, dest_name in images_map.items():
    src_path = os.path.join(source_dir, src_name)
    dest_path = os.path.join(target_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Скопирован: {src_name} -> {dest_name}")
    else:
        print(f"Ошибка: файл {src_name} не найден в {source_dir}")

# Копируем оригинальный измельчитель вместо сгенерированного
original_izmelchitel = os.path.join(target_dir, "original", "izmelchitel.png")
target_izmelchitel = os.path.join(target_dir, "izmelchitel.png")
if os.path.exists(original_izmelchitel):
    shutil.copy2(original_izmelchitel, target_izmelchitel)
    print("Использован оригинальный референс измельчителя газобетона.")
else:
    print(f"Ошибка: оригинальный измельчитель не найден по пути {original_izmelchitel}")

# Копируем оригинальный вибростол вместо сгенерированного
original_vibrostol = os.path.join(target_dir, "original", "vibrostol.png")
target_vibrostol = os.path.join(target_dir, "vibrostol.png")
if os.path.exists(original_vibrostol):
    shutil.copy2(original_vibrostol, target_vibrostol)
    print("Использован оригинальный референс вибростола.")
else:
    print(f"Ошибка: оригинальный вибростол не найден по пути {original_vibrostol}")

print("Готово!")
