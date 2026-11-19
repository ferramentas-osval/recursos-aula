#!/usr/bin/env python3
"""Pone (o actualiza) el candado de soluciones en un recurso HTML.

Uso:  python3 tools/candado.py <ruta/del/recurso.html> [--cifrar "SEL1;SEL2"] [--cifrar-atr "data-solution"] [--config "JS"] [--quitar]

- Inserta antes de </body> el bloque de tools/candado_soluciones.html con su configuración
  (window.CANDADO) y, si hay selectores en --cifrar, cifra el contenido de esos elementos
  (AES-GCM, clave PBKDF2 del código del profesor y de la ruta, igual que liberar_soluciones.mjs).
- El contenido queda vacío en el HTML y se repone al abrir el candado.
- La configuración y los selectores se guardan en el propio archivo, así que para
  actualizarlo basta con volver a ejecutar:  python3 tools/candado.py <ruta>
- Selectores admitidos: tag, .clase, #id, [atr], [atr^="x"], combinados (div.sol) y con
  descendiente (section[id^="sol-"] [data-build-in]). Se omiten los elementos que contienen
  x-connector, x-icon o img[data-video] (necesitan el script de la página al cargar).
El código del profesor se lee de la variable de entorno CANDADO_CODIGO (por defecto, el habitual).
"""
import os, re, sys, json, base64, html
from html.parser import HTMLParser
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOQUE = open(os.path.join(RAIZ, 'tools', 'candado_soluciones.html'), encoding='utf-8').read().strip()
CODIGO = os.environ.get('CANDADO_CODIGO', 'eclipse')
N = 150000
VACIOS = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr','param'}

def clave(id_):
    return PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=('recursos-aula:'+id_).encode(), iterations=N).derive(CODIGO.encode())

def cifra(id_, datos):
    iv = os.urandom(12)
    c = AESGCM(clave(id_)).encrypt(iv, json.dumps(datos, ensure_ascii=False).encode(), None)
    return {'i': base64.b64encode(iv).decode(), 'n': N, 'c': base64.b64encode(c).decode()}

def descifra(id_, d):
    p = AESGCM(clave(id_)).decrypt(base64.b64decode(d['i']), base64.b64decode(d['c']), None)
    return json.loads(p)

def parse_sel(sel):
    partes = []
    for comp in sel.strip().split():
        m = {'tag': None, 'cls': [], 'id': None, 'attr': []}
        for t in re.findall(r'(^[a-zA-Z][\w-]*|\.[\w-]+|#[\w-]+|\[[^\]]+\])', comp):
            if t[0] == '.': m['cls'].append(t[1:])
            elif t[0] == '#': m['id'] = t[1:]
            elif t[0] == '[':
                a = re.match(r'\[\s*([\w-]+)\s*(?:([\^$*]?=)\s*["\']?([^"\'\]]*)["\']?)?\s*\]', t)
                m['attr'].append((a.group(1), a.group(2), a.group(3)))
            else: m['tag'] = t.lower()
        partes.append(m)
    return partes

def casa(m, tag, at):
    if m['tag'] and m['tag'] != tag: return False
    if m['id'] and at.get('id') != m['id']: return False
    cl = (at.get('class') or '').split()
    if any(c not in cl for c in m['cls']): return False
    for n, op, v in m['attr']:
        if n not in at: return False
        x = at[n] or ''
        if op == '=' and x != v: return False
        if op == '^=' and not x.startswith(v): return False
        if op == '$=' and not x.endswith(v): return False
        if op == '*=' and v not in x: return False
    return True

class Buscador(HTMLParser):
    def __init__(self, src, sels):
        super().__init__(convert_charrefs=False)
        self.src = src; self.sels = [parse_sel(s) for s in sels]
        self.lin = [0]
        for i, ch in enumerate(src):
            if ch == '\n': self.lin.append(i+1)
        self.pila = []; self.abiertos = []; self.hallados = []
    def off(self):
        l, c = self.getpos(); return self.lin[l-1] + c
    def handle_starttag(self, tag, attrs):
        at = dict(attrs); ini = self.off(); fin = ini + len(self.get_starttag_text())
        for a in self.abiertos:
            if a['tag'] == tag: a['prof'] += 1
            if tag in ('x-connector', 'x-icon') or (tag == 'img' and 'data-video' in at): a['malo'] = True
        if tag in VACIOS: return
        dentro = any(True for _ in self.abiertos)
        if not dentro:
            for s in self.sels:
                if casa(s[-1], tag, at) and self._ancestros(s[:-1]):
                    self.abiertos.append({'tag': tag, 'prof': 0, 'ini': fin, 'tagini': ini, 'malo': False}); break
        self.pila.append((tag, at))
    def _ancestros(self, cadena):
        i = len(self.pila) - 1
        for m in reversed(cadena):
            while i >= 0 and not casa(m, *self.pila[i]): i -= 1
            if i < 0: return False
            i -= 1
        return True
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        for a in list(self.abiertos):
            if a['tag'] == tag:
                if a['prof'] == 0:
                    a['fin'] = self.off(); self.abiertos.remove(a)
                    if not a['malo']: self.hallados.append(a)
                else: a['prof'] -= 1
        for j in range(len(self.pila)-1, -1, -1):
            if self.pila[j][0] == tag: del self.pila[j:]; break

RE_BLOQ = re.compile(r'\n*<!--candado:inicio-->.*?<!--candado:fin-->\n?', re.S)

def procesar(ruta, cifrar=None, config=None, quitar=False, atr=None):
    rel = os.path.relpath(os.path.abspath(ruta), RAIZ).replace(os.sep, '/')
    s = open(ruta, encoding='utf-8').read()
    m = RE_BLOQ.search(s)
    if m:
        b = m.group(0)
        if cifrar is None:
            g = re.search(r'<!--cifrar:(.*?)-->', b); cifrar = html.unescape(g.group(1)) if g else ''
        if atr is None:
            g = re.search(r'<!--cifraratr:(.*?)-->', b); atr = g.group(1) if g else ''
        if config is None:
            g = re.search(r'<script>window\.CANDADO=Object\.assign\(\{id:[^}]*\},(.*?)\);</script>', b, re.S)
            config = g.group(1) if g else '{}'
        d = re.search(r'<script type="application/json" id="cdDatos">(.*?)</script>', b, re.S)
        s = s[:m.start()] + s[m.end():]
        if d:  # reponer el contenido cifrado antes de volver a cifrar
            arr = descifra(rel, json.loads(d.group(1)))
            def rep(mm):
                k = int(mm.group(2)); return mm.group(1) + arr[k] if k < len(arr) else mm.group(0)
            s = re.sub(r'(<[a-zA-Z][^>]*?) data-cd="(\d+)"([^>]*>)', lambda mm: mm.group(1) + mm.group(3) + '\x00CD%s\x00' % mm.group(2), s)
            s = re.sub(r'\x00CD(\d+)\x00', lambda mm: arr[int(mm.group(1))], s)
            s = re.sub(r' data-cda="(\d+):([\w-]+)"', lambda mm: ' %s="%s"' % (mm.group(2), html.escape(arr[int(mm.group(1))], quote=True)), s)
    if quitar:
        open(ruta, 'w', encoding='utf-8').write(s); print('Candado quitado:', rel); return
    cifrar = cifrar or ''; config = config or '{}'
    sels = [x for x in cifrar.split(';') if x.strip()]
    datos = []
    if sels:
        bz = Buscador(s, sels); bz.feed(s); bz.close()
        hall = sorted(bz.hallados, key=lambda a: a['ini'])
        out = []; pos = 0
        for k, a in enumerate(hall):
            datos.append(s[a['ini']:a['fin']])
            st = s[a['tagini']:a['ini']]
            st2 = st[:-1].rstrip() + ' data-cd="%d">' % k
            out.append(s[pos:a['tagini']]); out.append(st2); pos = a['fin']
        out.append(s[pos:]); s = ''.join(out)
    for nom in [x for x in (atr or '').split(';') if x.strip()]:
        def ra(mm, nom=nom):
            k = len(datos); datos.append(html.unescape(mm.group(1))); return 'data-cda="%d:%s"' % (k, nom)
        s = re.sub(r'(?<=\s)%s="([^"]*)"' % re.escape(nom), ra, s)
    enc = cifra(rel, datos)
    bloque = ('\n<!--candado:inicio--><!--cifrar:%s-->' % html.escape(cifrar, quote=False).replace('--', '&#45;&#45;') +
              ('<!--cifraratr:%s-->' % atr if atr else '') +
              '<script>window.CANDADO=Object.assign({id:%s},%s);</script>' % (json.dumps(rel), config) +
              '<script type="application/json" id="cdDatos">%s</script>\n' % json.dumps(enc) + BLOQUE + '\n<!--candado:fin-->')
    i = s.lower().rfind('</body>')
    s = s[:i] + bloque + '\n' + s[i:] if i >= 0 else s + bloque
    open(ruta, 'w', encoding='utf-8').write(s)
    print('Candado: %s · %d elementos cifrados' % (rel, len(datos)))

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    ruta = a[0]; cif = cfg = None; q = '--quitar' in a
    if '--cifrar' in a: cif = a[a.index('--cifrar')+1]
    if '--config' in a: cfg = a[a.index('--config')+1]
    at = a[a.index('--cifrar-atr')+1] if '--cifrar-atr' in a else None
    procesar(ruta, cif, cfg, q, at)
