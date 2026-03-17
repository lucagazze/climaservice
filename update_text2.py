import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Update testimonials heading
text = text.replace('Cartera construida 100% por referidos', 'Confianza respaldada por la industria')
text = text.replace('Cada cliente llegó por recomendación de otro. Esto es lo que dicen sobre nuestro trabajo.', 'Empresas líderes confían en Clima Service para garantizar el confort y la operación continua de sus instalaciones.')

# Also update the '100% por referidos' from the Why us section
text = text.replace('100% de clientes por referidos', 'Excelencia comprobable')
text = text.replace('Toda nuestra cartera se construyó por recomendación directa. El trabajo habla solo.', 'Nuestro compromiso con la calidad y los tiempos de entrega construye relaciones a largo plazo con cada cliente.')

# Update the hero image (find <div class="hero-img-frame">...</div>)
pattern = r'<div class="hero-img-frame">\s*<img[^>]+>\s*</div>'
replacement_str = '''<div class="hero-img-frame">
          <img src="./img_optimized/hero_img.png" alt="Técnico instalando aire acondicionado" loading="eager" style="width:100%; height:100%; object-fit:cover;">
        </div>'''
text = re.sub(pattern, replacement_str, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated testimonials text and hero image.')
