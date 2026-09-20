from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import zipfile,base64
root=Path(__file__).resolve().parents[1];p=root/'screens'
files=['01-site-address.png','02-search-results.png','03-added-to-cart.png','04-shopping-cart.png','05-checkout.png','06-purchase-success.png']
titles=['01  Site Address + Domain Search','02  Search Results','03  Added to Cart + Sort & Filter','04  Shopping Cart','05  Payment Setup','06  Connect to a Bio Page']
f='/System/Library/Fonts/Supplemental/Arial.ttf';font=ImageFont.truetype(f,26);small=ImageFont.truetype(f,18);big=ImageFont.truetype(f,42)
board=Image.new('RGB',(1900,2290),'#eeeaf5');d=ImageDraw.Draw(board);d.text((50,34),'tiny.BIO / Domain purchase',font=big,fill='#24133e');d.text((50,93),'Revision 2 · Six connected screens · Illustrative pricing',font=small,fill='#7b6c8b')
for i,(file,title) in enumerate(zip(files,titles)):
 im=Image.open(p/file).convert('RGB');im.thumbnail((885,625));x=50+i%2*930;y=153+i//2*698;d.text((x,y),title,font=font,fill='#24133e');board.paste(im,(x,y+46))
board.save(root/'domain-purchase-overview.png')
html='<!doctype html><html><meta charset="utf-8"><title>tiny.BIO · Domain purchase v2</title><style>body{font-family:Arial;margin:40px;background:#f4f1fa;color:#26133d}main{max-width:1450px;margin:auto}nav{display:flex;flex-wrap:wrap;gap:15px}nav a{color:#7946ff}img{width:100%;border-radius:15px}section{margin:45px 0}p{color:#7e6e92}</style><main><h1>tiny.BIO · Domain purchase / v2</h1><p>六屏流程原型 · 价格与付款均为演示数据</p><nav>'
html+=''.join(f'<a href="#s{i+1}">{title}</a>' for i,title in enumerate(titles))+'</nav>'
for i,(file,title) in enumerate(zip(files,titles)):
 html+=f'<section id="s{i+1}"><h2>{title}</h2><img src="data:image/png;base64,{base64.b64encode((p/file).read_bytes()).decode()}" alt="{title}"></section>'
(root/'six-screen-review.html').write_text(html+'</main></html>')
with zipfile.ZipFile(root/'tinybio-domain-purchase-screens.zip','w',zipfile.ZIP_DEFLATED) as z:
 for file in files:z.write(p/file,file)
 for file in ['domain-purchase-overview.png','six-screen-review.html']:z.write(root/file,file)
a=Image.open('/Users/dynadot/Desktop/Paid domain.png').convert('RGB');b=Image.open(p/'05-checkout.png').convert('RGB');a.thumbnail((1080,768));b.thumbnail((1080,768));c=Image.new('RGB',(2200,830),'#eeeaf5');c.paste(a,(10,50));c.paste(b,(1110,50));d=ImageDraw.Draw(c);d.text((15,12),'PAYMENT REFERENCE',font=font,fill='#24133e');d.text((1115,12),'REVISED PROTOTYPE',font=font,fill='#24133e');c.save(p/'payment-comparison.png')
