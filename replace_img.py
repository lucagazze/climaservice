import os
import random
import re

img_dir = 'img_optimized'
images = [f'./{img_dir}/{x}' for x in os.listdir(img_dir) if x.endswith('.webp')]
random.shuffle(images)

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace url('https://images.unsplash...')
bg_urls = set(re.findall(r"url\(['\"]?(https://images\.unsplash[^)'\"]+)['\"]?\)", text))
for bg in bg_urls:
    if images:
        text = text.replace(bg, images.pop())

# Replace img tags that have unsplash
img_tags = set(re.findall(r'<img[^>]+src=[\"\']([^\"\']*(?:unsplash|placeholder)[^\"\']*)[\"\'][^>]*>', text))
for src in img_tags:
    if images:
        text = text.replace(src, images.pop())

# Replace <div class="img-placeholder"> ... </div> with actual images
def get_new_img(match):
    global images
    if images:
        # We replace the whole div with an img tag that has similar classes or inline styles
        return f'<img src="{images.pop()}" alt="Clima Service Work" style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius); box-shadow: var(--shadow);" />'
    return match.group(0)

text = re.sub(r'<div class="img-placeholder">.*?</div>', get_new_img, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Replaced {len(bg_urls)} background URLs, {len(img_tags)} img sources, and placeholder divs.")
