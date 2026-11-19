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
 */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var P = PropertiesService.getScriptProperties();
    if (!d || d.codigo !== P.getProperty('CODIGO')) return salida_({ ok: false, error: 'Código incorrecto' });
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
function doGet() { return salida_({ ok: true, servicio: 'liberar soluciones recursos-aula' }); }
function salida_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
