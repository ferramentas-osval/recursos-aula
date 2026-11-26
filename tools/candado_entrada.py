#!/usr/bin/env python3
"""Candado de entrada: la página entera solo se abre con el código del profesor.

Cifra el HTML completo (AES-GCM, clave PBKDF2-SHA256 derivada del código) y lo
sustituye por una portada que pide el código (con botón 👁). Al acertar, descifra y
escribe la página original con document.write, así que sus scripts funcionan igual.
El código se recuerda solo durante la sesión del navegador.

Uso:  python3 tools/candado_entrada.py ruta/archivo.html [--codigo eclipse]
Se aplica al final, después de tools/candado.py (si se vuelve a ejecutar sobre un
archivo ya protegido, lo detecta y no hace nada).
"""
import base64, hashlib, html, os, sys, argparse
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ap = argparse.ArgumentParser()
ap.add_argument('ruta'); ap.add_argument('--codigo', default='eclipse')
a = ap.parse_args()
s = open(a.ruta, encoding='utf-8').read()
if '<!--entrada:cifrada-->' in s:
    print('ya protegida', a.ruta); sys.exit()
titulo = html.unescape(s.split('<title>', 1)[1].split('</title>', 1)[0]) if '<title>' in s else 'Recurso'
N = 200000
sal = os.urandom(16); iv = os.urandom(12)
k = hashlib.pbkdf2_hmac('sha256', a.codigo.encode(), sal, N, 32)
c = AESGCM(k).encrypt(iv, s.encode('utf-8'), None)
b = lambda x: base64.b64encode(x).decode()
out = '''<!DOCTYPE html>
<!--entrada:cifrada-->
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(t)s</title>
<style>
*{box-sizing:border-box}html,body{margin:0;height:100%%}
body{display:flex;align-items:center;justify-content:center;background:#14110d radial-gradient(circle at 50%% 30%%,#2c2418,#14110d 70%%);font-family:system-ui,'Segoe UI',sans-serif;color:#f6e7c1}
.c{width:min(92vw,460px);background:#1e1912;border:2px solid #c99a2e;border-radius:18px;padding:28px 26px;text-align:center;box-shadow:0 0 50px rgba(201,154,46,.25)}
.c .i{font-size:54px}.c h1{font-size:22px;margin:.3em 0 .2em;color:#f3c552}.c p{margin:.2em 0 1em;opacity:.85;font-size:15px}
.f{display:flex;gap:8px}.w{position:relative;flex:1}
input{width:100%%;font-size:20px;padding:12px 46px 12px 14px;border-radius:10px;border:2px solid #c99a2e;background:#fffaf0;color:#2a2118}
.ojo{position:absolute;right:6px;top:50%%;transform:translateY(-50%%);border:0;background:none;font-size:22px;cursor:pointer}
.b{font-size:18px;font-weight:700;padding:0 18px;border-radius:10px;border:2px solid #2a2118;background:#f3c552;color:#2a2118;cursor:pointer}
.e{min-height:1.4em;color:#ff8a7a;margin-top:.7em;font-weight:600}
.sh{animation:sh .35s}@keyframes sh{25%%{transform:translateX(-8px)}75%%{transform:translateX(8px)}}
</style></head><body>
<form class="c" id="f" autocomplete="off"><div class="i">🔒</div><h1>%(t)s</h1><p>Introduce el código para abrir la presentación.</p>
<div class="f"><div class="w"><input id="k" type="password" placeholder="Código" autofocus aria-label="Código"><button type="button" class="ojo" id="o" aria-label="Mostrar u ocultar el código">👁</button></div><button class="b">Entrar</button></div>
<div class="e" id="e"></div></form>
<script>
(function(){
var D={s:"%(s)s",i:"%(i)s",n:%(n)d,c:"%(c)s"},K='entrada:'+location.pathname;
function u(x){return Uint8Array.from(atob(x),function(ch){return ch.charCodeAt(0)})}
async function abrir(code){
  var km=await crypto.subtle.importKey('raw',new TextEncoder().encode(code),'PBKDF2',false,['deriveKey']);
  var key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:u(D.s),iterations:D.n,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
  var p=await crypto.subtle.decrypt({name:'AES-GCM',iv:u(D.i)},key,u(D.c));
  var h=new TextDecoder().decode(p);try{sessionStorage.setItem(K,code)}catch(e){}
  document.open();document.write(h);document.close();
}
var f=document.getElementById('f'),k=document.getElementById('k'),e=document.getElementById('e');
document.getElementById('o').onclick=function(){k.type=k.type==='password'?'text':'password';k.focus()};
f.onsubmit=function(ev){ev.preventDefault();e.textContent='Comprobando…';
  abrir(k.value.trim().toLowerCase()).catch(function(){e.textContent='Código incorrecto';f.classList.remove('sh');void f.offsetWidth;f.classList.add('sh');k.select()})};
var g=null;try{g=sessionStorage.getItem(K)}catch(x){}
if(g)abrir(g).catch(function(){try{sessionStorage.removeItem(K)}catch(x){}});
})();
</script></body></html>
''' % {'t': html.escape(titulo), 's': b(sal), 'i': b(iv), 'n': N, 'c': b(c)}
open(a.ruta, 'w', encoding='utf-8').write(out)
print('ok', a.ruta, len(out))
