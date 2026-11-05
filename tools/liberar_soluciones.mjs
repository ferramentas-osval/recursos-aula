// Libera para todos las soluciones de un recurso cifrado con PIN.
// Uso: node tools/liberar_soluciones.mjs <ruta/del/recurso.html> <PIN>
//      node tools/liberar_soluciones.mjs <ruta/del/recurso.html> --ocultar
// La clave se deriva del PIN y de la ruta (PBKDF2, 150000 iteraciones), así que
// publicarla abre solo ese recurso y no revela el PIN.
import {readFileSync,writeFileSync} from 'node:fs';
import {webcrypto as C} from 'node:crypto';
const [id,pin]=process.argv.slice(2);
if(!id||!pin){console.error('Uso: node tools/liberar_soluciones.mjs <ruta.html> <PIN|--ocultar>');process.exit(1)}
const f=new URL('../assets/soluciones_liberadas.json',import.meta.url);
const j=JSON.parse(readFileSync(f,'utf8'));
if(pin==='--ocultar'){delete j[id]}else{
  const e=new TextEncoder();
  const km=await C.subtle.importKey('raw',e.encode(pin),'PBKDF2',false,['deriveKey']);
  const k=await C.subtle.deriveKey({name:'PBKDF2',salt:e.encode('recursos-aula:'+id),iterations:150000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},true,['encrypt']);
  j[id]=Buffer.from(await C.subtle.exportKey('raw',k)).toString('base64');
}
writeFileSync(f,JSON.stringify(j,null,1)+'\n');console.log('Actualizado:',Object.keys(j));
