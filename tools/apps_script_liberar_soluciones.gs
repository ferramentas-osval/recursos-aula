/**
 * Liberar / ocultar soluciones para todo el alumnado (recursos-aula).
 * Proyecto de Apps Script en la cuenta ferramentas.osval@gmail.com.
 *
 * Propiedades del script (Configuración del proyecto → Propiedades del script):
 *   GITHUB_TOKEN  token «fine-grained» con permiso Contents: Read and write SOLO en ferramentas-osval/recursos-aula
 *   CODIGO        el código del profesor (el mismo del candado)
 *   REPO          ferramentas-osval/recursos-aula
 *
 * Implementar → Nueva implementación → Aplicación web:
 *   Ejecutar como: Yo (ferramentas.osval@gmail.com) · Quién tiene acceso: Cualquier usuario
 * La URL /exec que se obtiene va en assets/candado_config.json → "liberar_url".
 *
 * MODO EQUIPO (accion: 'estado' + GET ?estado=1): el proyector publica la prueba en curso y los ordenadores de los grupos la siguen (caché de 6 h, sin datos personales).
 *
 * NOTAS DE LOS RETOS (accion: 'notas'): los retos por grupos (p. ej. reto_narracion_resumen_ortografia_1eso.html)
 * envían al terminar las notas a una hoja de cálculo PRIVADA de esta cuenta (nunca al repositorio público).
 * La hoja «Notas de los retos · recursos-aula» se crea sola la primera vez y su id se guarda en la propiedad HOJA_NOTAS.
 * Tras pegar este código: ejecutar una vez prepararHojaNotas() (pide permiso para Hojas de cálculo) y después
 * Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar (la URL no cambia).
 */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var P = PropertiesService.getScriptProperties();
    if (d && d.accion === 'practica') return salida_(practica_(d));
    if (!d || d.codigo !== P.getProperty('CODIGO')) return salida_({ ok: false, error: 'Código incorrecto' });
    if (d.accion === 'notas') return salida_(notas_(d));
    if (d.accion === 'estado') {
      CacheService.getScriptCache().put('estado_reto', JSON.stringify({ e: d.estado || null, t: Date.now() }), 21600);
      return salida_({ ok: true });
    }
    var id = String(d.id || '');
    if (!/\.html$/.test(id) || id.indexOf('..') >= 0 || id.charAt(0) === '/') return salida_({ ok: false, error: 'Recurso no válido' });
    if (d.accion !== 'liberar' && d.accion !== 'ocultar') return salida_({ ok: false, error: 'Acción no válida' });
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var api = 'https://api.github.com/repos/' + P.getProperty('REPO') + '/contents/assets/soluciones_liberadas.json';
      var h = { Authorization: 'Bearer ' + P.getProperty('GITHUB_TOKEN'), Accept: 'application/vnd.github+json' };
      var r = JSON.parse(UrlFetchApp.fetch(api + '?ref=main', { headers: h }).getContentText());
      var j = JSON.parse(Utilities.newBlob(Utilities.base64Decode(r.content.replace(/\n/g, ''))).getDataAsString('UTF-8'));
      if (d.accion === 'liberar') j[id] = d.clave || 'liberado';
      else delete j[id];
      var txt = JSON.stringify(j, null, 1) + '\n';
      UrlFetchApp.fetch(api, {
        method: 'put', headers: h, contentType: 'application/json',
        payload: JSON.stringify({
          message: (d.accion === 'liberar' ? 'Liberar' : 'Ocultar') + ' soluciones: ' + id,
          content: Utilities.base64Encode(txt, Utilities.Charset.UTF_8), sha: r.sha, branch: 'main'
        })
      });
    } finally { lock.releaseLock(); }
    return salida_({ ok: true });
  } catch (err) {
    return salida_({ ok: false, error: String(err && err.message || err) });
  }
}
function notas_(d) {
  var P = PropertiesService.getScriptProperties();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = null, id = P.getProperty('HOJA_NOTAS');
    if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
    if (!ss) { ss = SpreadsheetApp.create('Notas de los retos · recursos-aula'); P.setProperty('HOJA_NOTAS', ss.getId()); }
    var nom = String(d.hoja || 'Notas').replace(/[\[\]\*\?\/\\:]/g, ' ').slice(0, 90);
    var sh = ss.getSheetByName(nom);
    if (!sh) {
      sh = ss.insertSheet(nom);
      ss.getSheets().forEach(function (x) { if (x.getSheetId() !== sh.getSheetId() && x.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(x); });
      if (d.cabecera && d.cabecera.length) {
        sh.appendRow(d.cabecera);
        sh.getRange(1, 1, 1, d.cabecera.length).setFontWeight('bold').setBackground('#fff1b8');
        sh.setFrozenRows(1);
      }
    }
    var f = (d.filas || []).filter(function (r) { return Array.isArray(r); }).map(function (r) {
      return r.map(function (c) { return typeof c === 'number' ? c : String(c == null ? '' : c).slice(0, 500); });
    });
    if (f.length) {
      var w = Math.max.apply(null, f.map(function (r) { return r.length; }));
      f = f.map(function (r) { while (r.length < w) r.push(''); return r; });
      sh.getRange(sh.getLastRow() + 1, 1, f.length, w).setValues(f);
    }
    return { ok: true, url: ss.getUrl(), filas: f.length };
  } finally { lock.releaseLock(); }
}
/* Ejecutar UNA vez desde el editor para dar permiso y crear la hoja; en el registro aparece su enlace. */
function prepararHojaNotas() { Logger.log(notas_({ hoja: 'Prueba de conexión', cabecera: ['Fecha', 'Mensaje'], filas: [[new Date(), 'Conexión correcta']] }).url); }
/* Plenos de práctica de los ordenadores de los grupos (modo equipo): sin código, solo números, caché de 6 h. */
function practica_(d) {
  var n = String(d.n || '').replace(/\D/g, '').slice(0, 15), g = parseInt(d.g, 10);
  if (!n || !(g >= 0 && g < 12)) return { ok: false, error: 'Datos no válidos' };
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var c = CacheService.getScriptCache(), k = 'practica_' + n, l = JSON.parse(c.get(k) || '[]');
    if (l.indexOf(g) < 0) l.push(g);
    c.put(k, JSON.stringify(l), 21600);
    return { ok: true };
  } finally { lock.releaseLock(); }
}
function doGet(e) {
  if (e && e.parameter && e.parameter.practica) {
    var c = CacheService.getScriptCache(), o = {};
    String(e.parameter.practica).split(',').slice(0, 5).forEach(function (n) { n = n.replace(/\D/g, ''); if (n) o[n] = JSON.parse(c.get('practica_' + n) || '[]'); });
    return salida_({ ok: true, plenos: o });
  }
  if (e && e.parameter && e.parameter.estado) {
    var c = CacheService.getScriptCache().get('estado_reto'), o = c ? JSON.parse(c) : { e: null, t: Date.now() };
    return salida_({ ok: true, estado: o.e, edad: (Date.now() - o.t) / 1000 });
  }
  return salida_({ ok: true, servicio: 'liberar soluciones recursos-aula' });
}
function salida_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
