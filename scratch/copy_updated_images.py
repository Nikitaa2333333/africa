import os
import shutil
from process_mixer import process_mixer

artifacts_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\bd682371-fadf-4114-b98b-e46d971185c7"
project_dir = r"c:\Users\User\Downloads\new afc"
target_images_dir = os.path.join(project_dir, "assets", "images", "projects")

# Источники
src_vibrostol = os.path.join(artifacts_dir, "vibrostol_8k_1779459301218.png")
src_izmelchitel = os.path.join(artifacts_dir, "izmelchitel_8k_1779459317954.png")

# Цели
dest_vibrostol = os.path.join(target_images_dir, "vibrostol.png")
dest_izmelchitel = os.path.join(target_images_dir, "izmelchitel.png")

print("1. Копируем качественный вибростол 8k (синяя рама) из артефактов...")
if os.path.exists(src_vibrostol):
    shutil.copy2(src_vibrostol, dest_vibrostol)
    print("Вибростол успешно скопирован!")
else:
    print(f"Ошибка: не найден {src_vibrostol}")

print("\n2. Копируем качественный измельчитель 8k из артефактов...")
if os.path.exists(src_izmelchitel):
    shutil.copy2(src_izmelchitel, dest_izmelchitel)
    print("Измельчитель успешно скопирован!")
else:
    print(f"Ошибка: не найден {src_izmelchitel}")

print("\n3. Запускаем обработку смесителя-активатора...")
process_mixer()

print("\nВсе шаги по обновлению изображений выполнены!")
