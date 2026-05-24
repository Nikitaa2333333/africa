import os
from PIL import Image, ImageEnhance, ImageFilter

def process_mixer():
    input_path = r"c:\Users\User\Downloads\new afc\assets\images\projects\smesitel_aktivator.png"
    output_path = r"c:\Users\User\Downloads\new afc\assets\images\projects\smesitel_aktivator.png"
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} does not exist")
        return
        
    with Image.open(input_path) as img:
        # Конвертируем в RGBA
        img = img.convert("RGBA")
        
        # 1. Апскейл до 1024x1024 с помощью Lanczos
        img_large = img.resize((1024, 1024), Image.Resampling.LANCZOS)
        
        # 2. Повышение резкости (Sharpen)
        # Применяем фильтр UnsharpMask для лучшей детализации краев
        img_sharp = img_large.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
        
        # 3. Очистка фона
        # Создаем новое белое изображение
        white_bg = Image.new("RGBA", img_sharp.size, (255, 255, 255, 255))
        
        datas = img_sharp.getdata()
        new_data = []
        for item in datas:
            r, g, b, a = item
            # Если пиксель очень светлый (серый/почти белый фон), делаем его белым
            # Смеситель синий, так что у него R и G значительно ниже, чем B
            # Фоновые пиксели обычно имеют R, G, B близкие друг к другу и достаточно высокие (светло-серые)
            is_background = False
            
            # Фоновые пиксели вокруг объекта на оригинале:
            # Они имеют высокую яркость (например > 235) и низкую насыщенность (разница между R, G, B мала)
            max_diff = max(abs(r - g), abs(r - b), abs(g - b))
            if r > 230 and g > 230 and b > 230 and max_diff < 15:
                is_background = True
            elif r > 240 and g > 240 and b > 240:
                is_background = True
                
            if is_background:
                # Плавное размытие краев (альфа-смешивание) - делаем прозрачным для наложения на белый фон
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append((r, g, b, a))
                
        img_sharp.putdata(new_data)
        
        # Накладываем на чистый белый фон
        final_img = Image.alpha_composite(white_bg, img_sharp)
        
        # 4. Цветокоррекция (усиление синего цвета и контраста)
        final_img = final_img.convert("RGB")
        
        # Улучшаем насыщенность (Color)
        converter = ImageEnhance.Color(final_img)
        final_img = converter.enhance(1.3) # Делаем синий сочнее
        
        # Улучшаем контрастность
        converter = ImageEnhance.Contrast(final_img)
        final_img = converter.enhance(1.1)
        
        # Сохраняем результат
        final_img.save(output_path, "PNG")
        print(f"Successfully processed smesitel_aktivator.png and saved to {output_path}")

if __name__ == "__main__":
    process_mixer()
