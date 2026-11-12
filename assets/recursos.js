/* Recursos de aula · motor de páginas */
(function(){
const HID=window.OCULTOS||[], SHOWALL=/[?&]ver=todo\b/.test(location.search);
const isHidden=h=>!SHOWALL&&HID.some(x=>h===x||(x.endsWith('/')&&h.startsWith(x)));
function prune(n){if(n.h)return isHidden(n.h)?null:n;const c=n.c.map(prune).filter(Boolean);return c.length?{n:n.n,c}:null}
const DATA=(window.RECURSOS||[]).map(prune).filter(Boolean), NEW=window.NUEVOS||[], PAGE=window.PAGE||{mode:'home',root:''};
const ROOT=PAGE.root||'';
/* Modo alumnado: con ?alumnado en la dirección no aparece el enlace a «Todos los recursos» */
const ALUM=/[?&]alumnado\b/.test(location.search);
const CATS={
 '01. ESO':{name:'1.º ESO',icon:'🎒',col:'--c1',desc:'Presentaciones y actividades de Lengua Castellana y Literatura para 1.º de ESO.',
   layout:{apartados:[
    {titulo:'Presentaciones temas lengua',icon:'🎞️',archivos:['01_ESO/1_Y_2/PRESENTACIONES/presentacion_lenguas_mundo.html','01_ESO/1_Y_2/PRESENTACIONES/presentacion_lenguas_espana.html','01_ESO/1_Y_2/PRESENTACIONES/presentacion_comunicacion.html','01_ESO/1_Y_2/PRESENTACIONES/presentacion_propiedades_textuales_cca.html','01_ESO/1_Y_2/PRESENTACIONES/presentacion_narracion.html']},
    {titulo:'Tareas',icon:'✏️',archivos:['01_ESO/1_Y_2/TAREAS/taller_resumen_earhart.html','01_ESO/1_Y_2/TAREAS/reto_comunicacion_1eso.html','01_ESO/1_Y_2/TAREAS/practica_comunicacion_1eso.html']},
    {titulo:'Ortografía y vocabulario',icon:'🔤',archivos:['01_ESO/1_Y_2/PRESENTACIONES/vocabulario_1.html','01_ESO/1_Y_2/PRESENTACIONES/vocabulario_2.html',{titulo:'Ortografía 1',icon:'🔤',par:['01_ESO/1_Y_2/PRESENTACIONES/presentacion_ortografia_1.html','01_ESO/1_Y_2/ACTIVIDADES/ficha_ortografia_1.html']}]},
    {titulo:'Apuntes y modelos de exámenes',icon:'📒',archivos:['01_ESO/1_Y_2/APUNTES_EXAMENES/apuntes_repaso_primer_examen.html','01_ESO/1_Y_2/MODELOS_EXAMENES/modelo_examen_primer_parcial_1a_evaluacion_1eso.html']},
    {titulo:'Obras de lectura',icon:'📚',archivos:['01_ESO/1_Y_2/PRESENTACIONES/presentacion_nando_lopez_libro.html','01_ESO/1_Y_2/OBRAS_LECTURA/prueba_lectura_por_que_tiene_que_ser_todo_tan_dificil.html']}],
    quitar:['1º','Presentaciones','Tareas'],evaluacion:'1ª evaluación'}},
 '02. BACH':{name:'Bachillerato',icon:'🎓',col:'--c2',desc:'Unidades didácticas, actividades y presentaciones de Lengua y Literatura para Bachillerato.'},
 '03. FPB':{name:'FP Básica',icon:'🔧',col:'--c3',desc:'Actividades y talleres para FP Básica.',layout:{evaluacion:'1ª evaluación'}},
 '04. PDC':{name:'PDC · Diversificación',icon:'🧭',col:'--c4',desc:'Materiales del Ámbito Lingüístico y Social de 3.º ESO PDC: presentaciones, actividades y tutorías.',
   layout:{
    destacados:[
     {h:'04_PDC/reparticion_ambito_linguistico_social_3eso_pdc.html',titulo:'Horario ámbito lingüístico y social',sub:'Materias por días y horas · 3.º ESO PDC',icon:'🗓️',tipo:'horario'},
     {carpeta:'Tutorías',titulo:'Tutoría',sub:'Vídeos, charlas, técnicas de estudio y juegos',icon:'💬',tipo:'tutoria'}],
    quitar:['Presentaciones'],
    materias:{'Comunicación':'🎙️','Lengua y literatura castellanas':'📖','Lingua e literatura galegas':'📗','Xeografía':'🌍','Historia':'🏛️','Actividades':'✏️','Apuntes y modelos de exámenes':'📒'},
    evaluacion:'1ª evaluación'}},
 'ACTIVIDADES LÚDICAS':{name:'Actividades lúdicas',icon:'🎲',col:'--c5',desc:'Bingos, banderas, pasatiempos, ruletas y juegos de vocabulario para aprender jugando.'},
 'ACTIVIDADES PERSONAJES HISTÓRICOS':{name:'Personajes históricos',icon:'🕵️',col:'--c6',desc:'Expedientes interactivos para investigar la vida de grandes personajes de la historia.'},
 'PROYECTOS COMPETENCIALES':{name:'Proyectos competenciales',icon:'📻',col:'--c7',desc:'Proyectos para aprender haciendo: radio, entrevistas y mucho más.'},
 'TALLERES Y TÉCNICAS DE ESTUDIO':{name:'Talleres y técnicas de estudio',icon:'🧠',col:'--c8',desc:'Talleres de resumen, comentario y técnicas de estudio.'}};
const KEEP={BACH:'Bach.',PDC:'PDC',ESO:'ESO',LCL:'LCL',FPB:'FPB'};
const nice=s=>s.split(' ').map((w,i)=>KEEP[w]||(i===0?w.charAt(0)+w.slice(1).toLowerCase():w.toLowerCase())).join(' ').replace(/\bY\b/g,'y');
const folderOf=c=>{let h=null;(function f(n){if(h)return;if(n.h)h=n.h;else n.c.forEach(f)})(c);return h.split('/')[0]};
function kind(h){const f=h.split('/').pop().toLowerCase();
 if(/^apuntes/.test(f))return['📒','Apuntes'];if(/^prueba_lectura/.test(f))return['📖','Prueba de lectura'];if(/^modelo_examen|^primer_parcial/.test(f))return['📝','Modelo de examen'];if(/presentacion/.test(f))return['🎞️','Presentación'];if(/^unidad/.test(f))return['📘','Unidad didáctica'];
 if(/taller|prompt|promts|epl2r/.test(f))return['🛠️','Taller'];if(/bingo|atlas|bandera|pasaporte|pasatiempo|ruleta|vocabulario/.test(f))return['🎲','Juego'];
 if(/expediente/.test(f))return['🕵️','Expediente'];if(/tutoria/.test(f))return['💬','Tutoría'];
 if(/actividad|ejercicio|reto|soluciones|sujeto/.test(f))return['✏️','Actividad'];return['📄','Recurso']}
function groups(node,path,out){const files=node.c.filter(c=>c.h);if(files.length)out.push({path,files});node.c.filter(c=>c.c).forEach(c=>groups(c,path.concat(nice(c.n)),out));return out}
const count=n=>n.h?1:n.c.reduce((a,c)=>a+count(c),0);
const info=c=>CATS[c.n]||{name:nice(c.n),icon:'📁',col:'--c1',desc:''};
/* Organización a medida de un apartado: apartados con archivos concretos, niveles que se quitan, orden de materias */
function ordenar(gs,L){let out=[];
 (L.apartados||[]).forEach(a=>{const fs=[];const take=h=>{let r=null;gs.forEach(g=>{const i=g.files.findIndex(x=>x.h===h);if(i>-1&&!r)r=g.files.splice(i,1)[0]});return r};a.archivos.forEach(h=>{if(typeof h==='object'){const ps=h.par.map(take).filter(Boolean);if(ps.length)fs.push({par:ps,t:h.titulo,ic:h.icon||'🔤'})}else{const f=take(h);if(f)fs.push(f)}});if(fs.length)out.push({path:[a.titulo],files:fs,ic:a.icon})});
 gs=gs.filter(g=>g.files.length);
 if(L.quitar){const m=new Map();gs.forEach(g=>{const p=g.path.filter(x=>!L.quitar.includes(x));const k=p.join(' › ');if(m.has(k))m.get(k).files.push(...g.files);else m.set(k,{path:p,files:g.files.slice()})});gs=[...m.values()]}
 const MAT=L.materias;if(MAT){const o=Object.keys(MAT);const r=g=>{const i=o.indexOf(g.path[g.path.length-1]);return i<0?99:i};gs.sort((a,b)=>r(a)-r(b));gs.forEach(g=>g.ic=MAT[g.path[g.path.length-1]]||'📁')}
 if(L.apartados)gs.forEach(g=>g.ic=g.ic||'📁');
 return out.concat(gs)}
const HERO=`<svg viewBox="0 0 420 320" aria-hidden="true">
      <defs><linearGradient id="pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#eef3f7"/></linearGradient></defs>
      <ellipse cx="210" cy="292" rx="170" ry="16" fill="#000" opacity=".15"/>
      <!-- libro abierto -->
      <g class="float">
        <path d="M60 110 Q135 82 205 112 L205 268 Q135 240 60 262 Z" fill="url(#pg)"/>
        <path d="M350 110 Q275 82 205 112 L205 268 Q275 240 350 262 Z" fill="#f7f9fb"/>
        <path d="M205 112 L205 268" stroke="#c8d3dd" stroke-width="3"/>
        <path d="M52 118 L52 270 Q135 248 205 276 Q275 248 358 270 L358 118" fill="none" stroke="#ffd75e" stroke-width="8" stroke-linejoin="round"/>
        <g stroke="#b7c4d1" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M82 135 Q135 118 185 137"/><path d="M82 160 Q135 143 185 162"/><path d="M82 185 Q135 168 185 187"/><path d="M82 210 Q120 198 160 210"/>
          <path d="M225 137 Q275 118 328 135"/><path d="M225 162 Q275 143 328 160"/>
        </g>
        <rect x="236" y="180" width="80" height="50" rx="8" fill="#0f8b82" opacity=".85"/>
        <path d="M262 192 L262 218 L286 205 Z" fill="#fff"/>
      </g>
      <!-- bocadillos -->
      <g class="float2">
        <path d="M70 30 h86 a16 16 0 0 1 16 16 v34 a16 16 0 0 1 -16 16 h-50 l-20 18 v-18 h-16 a16 16 0 0 1 -16 -16 v-34 a16 16 0 0 1 16 -16 z" fill="#ffd75e"/>
        <text x="113" y="76" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="34" fill="#5a4300">Aa</text>
        <path d="M268 18 h88 a16 16 0 0 1 16 16 v30 a16 16 0 0 1 -16 16 h-16 v18 l-20 -18 h-52 a16 16 0 0 1 -16 -16 v-30 a16 16 0 0 1 16 -16 z" fill="#fff"/>
        <circle cx="290" cy="49" r="7" fill="#d9567a"/><circle cx="312" cy="49" r="7" fill="#6b5bd2"/><circle cx="334" cy="49" r="7" fill="#2e86c9"/>
      </g>
      <!-- lápiz -->
      <g transform="rotate(-35 360 210)" class="float">
        <rect x="330" y="150" width="26" height="120" rx="4" fill="#e98a1c"/>
        <rect x="330" y="150" width="26" height="16" fill="#d9567a"/>
        <rect x="330" y="166" width="26" height="6" fill="#c8d3dd"/>
        <path d="M330 270 L356 270 L343 298 Z" fill="#f6dcb5"/><path d="M339 289 L347 289 L343 298 Z" fill="#1f2633"/>
      </g>
      <!-- estrellas -->
      <g fill="#ffd75e"><path d="M30 200 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2 z" opacity=".9"/><path d="M392 120 l3 7 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 z"/><circle cx="240" cy="10" r="4"/><circle cx="20" cy="120" r="3"/></g>
    </svg>`;
const WAVE='<svg class="wave" viewBox="0 0 1440 70" preserveAspectRatio="none"><path d="M0 40 C240 80 480 0 720 30 C960 60 1200 10 1440 40 L1440 70 L0 70 Z" fill="#f6f2ea"/></svg>';
function parCard(f,ctx){const nu=f.par.some(x=>NEW.includes(x.h));const ls=f.par.map(x=>{const [ic,lab]=kind(x.h);return `<a class="parlink" href="${ROOT+x.h}" target="_blank" rel="noopener">${/^ficha/.test(x.h.split('/').pop())?'📝 Ficha':ic+' '+lab}</a>`}).join('');return `<div class="card par" data-t="${(f.t+' '+f.par.map(x=>x.t+' '+kind(x.h)[1]).join(' ')+' '+ctx).toLowerCase().replace(/"/g,'')}">${nu?'<span class="new">NUEVO</span>':''}<div class="ticon">${f.ic}</div><div><small>Presentación + ficha</small><b>${f.t}</b><div class="parlinks">${ls}</div></div></div>`}
function card(f,lab0,ctx){if(f.par)return parCard(f,ctx);const [ic,lab]=kind(f.h);return `<a class="card" href="${ROOT+f.h}" target="_blank" rel="noopener" data-t="${(f.t+' '+lab+' '+ctx).toLowerCase().replace(/"/g,'')}">${NEW.includes(f.h)?'<span class="new">NUEVO</span>':''}<div class="ticon">${ic}</div><div><small>${lab}</small><b>${f.t}</b></div><span class="go">→</span></a>`}
function groupHTML(g,ctx,ic){return `<div class="group${ic?' materia':''}"><h3>${ic?`<span class="mic">${ic}</span>`:''}${g.path.length?g.path.join(' › '):'General'}</h3><div class="grid">${g.files.map(f=>card(f,'',ctx+' '+g.path.join(' '))).join('')}</div></div>`}
function stat(b,s){return `<div class="stat"><b>${b}</b><small>${s}</small></div>`}
const app=document.getElementById('app');let html='';
if(PAGE.mode==='course'){
 const cat=DATA.find(c=>c.n===PAGE.key)||{n:PAGE.key,c:[]};const I=info(cat);let gs=groups(cat,[],[]);
 const L=I.layout||{};let top='',topChips=[];
 // destacados: horario (un recurso) y tutoría (una carpeta) arriba del todo
 (L.destacados||[]).forEach((d,k)=>{
  if(d.h){let f=null;gs.forEach(g=>{const i=g.files.findIndex(x=>x.h===d.h);if(i>-1){f=g.files.splice(i,1)[0]}});gs=gs.filter(g=>g.files.length);
   if(!f)return;top+=`<a class="feature f-${d.tipo}" id="d${k}" href="${ROOT+f.h}" target="_blank" rel="noopener"><span class="fic">${d.icon}</span><span><b>${d.titulo}</b><small>${d.sub||''}</small></span><span class="fgo">Abrir →</span></a>`}
  else{const sel=gs.filter(g=>g.path[0]===d.carpeta);gs=gs.filter(g=>g.path[0]!==d.carpeta);const fs=[].concat(...sel.map(g=>g.files));if(!fs.length)return;
   top+=`<div class="feature f-${d.tipo}" id="d${k}"><div class="fhead"><span class="fic">${d.icon}</span><span><b>${d.titulo}</b><small>${d.sub||''}</small></span></div><div class="grid">${fs.map(f=>card(f,'',I.name+' '+d.titulo)).join('')}</div></div>`}
  topChips.push(`<a class="chip" style="--cc:var(${I.col})" href="#d${k}">${d.titulo.split(' ')[0]}</a>`)});
 gs=ordenar(gs,L);
 // quitar el primer nivel si todos los grupos lo comparten (p. ej. «1º y 2º»)
 document.documentElement.style.setProperty('--cc',`var(${I.col})`);document.title=I.name+' · Recursos de aula';
 html+=`<header class="coursehead"><div class="hero"><div>${ALUM?'':`<a class="back" href="${ROOT}index.html">← Todos los recursos</a><br>`}<span class="kicker">Recursos de aula · Lengua y Literatura</span><h1>${I.name}</h1><p class="lead">${I.desc}</p><div class="stats">${stat(count(cat),'recursos')}${stat(gs.length,gs.length===1?'apartado':'apartados')}</div></div>
 <div class="bigicon"><div class="disc"></div><div class="disc2"></div><span class="orb float" style="width:22px;height:22px;top:10%;right:16%"></span><span class="orb float2" style="width:14px;height:14px;bottom:14%;left:12%"></span><span class="orb float" style="width:10px;height:10px;top:30%;left:6%;background:#fff"></span><span class="emo float">${I.icon}</span></div></div>${WAVE}</header>`;
 html+=`<div class="toolbar"><div class="searchrow"><label class="search">🔎<input id="q" type="search" placeholder="Buscar en ${I.name}…" autocomplete="off"></label><span id="count"></span></div><nav class="chips">${topChips.join('')}${gs.map((g,i)=>`<a class="chip" style="--cc:var(${I.col})" href="#g${i}">${g.path.length?g.path[g.path.length-1]:'General'}</a>`).join('')}</nav></div>`;
 const gh=gs.map((g,i)=>groupHTML(g,I.name,g.ic).replace(/^<div class="group([^"]*)">/,`<div class="group$1" id="g${i}" style="scroll-margin-top:130px">`));
 const last=g=>g.path[g.path.length-1];let body='';
 for(let i=0;i<gs.length;i++){const par=(L.juntos||[]).find(p=>p[0]===last(gs[i]));
  if(par&&gs[i+1]&&par[1]===last(gs[i+1])){body+=`<div class="pair">${gh[i]}${gh[i+1]}</div>`;i++}else body+=gh[i]}
 if(L.evaluacion)body=`<div class="eval"><h2 class="evaltag">${L.evaluacion}</h2>${body}</div>`;
 html+=`<main><section class="cat" style="--cc:var(${I.col})">${top}${body}</section></main>`;
}else{
 let total=DATA.reduce((a,c)=>a+count(c),0);
 html+=`<header><div class="hero"><div><span class="kicker">Lengua y Literatura · Materiales interactivos</span><h1>Recursos <span>de aula</span></h1><p class="lead">Presentaciones, actividades, unidades didácticas, talleres y juegos para trabajar en clase y repasar en casa. Elige tu curso o busca directamente lo que necesitas.</p><div class="stats">${stat(total,'recursos')}${stat(DATA.length,'apartados')}${stat('100&nbsp;%','interactivos')}</div></div>${HERO}</div>${WAVE}</header>`;
 html+=`<div class="toolbar"><div class="searchrow"><label class="search">🔎<input id="q" type="search" placeholder="Buscar un recurso: «sintaxis», «Turing», «bingo»…" autocomplete="off"></label><span id="count"></span></div></div>`;
 html+=`<main><div id="coursesBlock"><h2 class="sectiontitle">Elige tu curso o apartado</h2><div class="courses">${DATA.map(c=>{const I=info(c);const n=count(c);return `<a class="course" style="--cc:var(${I.col})" href="${folderOf(c)}/index.html"><span class="arrow">↗</span><span class="ci">${I.icon}</span><h3>${I.name}</h3><span>${n} recurso${n>1?'s':''}</span></a>`}).join('')}</div></div>
 <h2 class="sectiontitle" id="allTitle">Todos los recursos</h2>`;
 DATA.forEach(c=>{const I=info(c);const gs=ordenar(groups(c,[],[]),I.layout||{});html+=`<section class="cat" style="--cc:var(${I.col})"><div class="cathead"><a class="caticon" href="${folderOf(c)}/index.html" style="text-decoration:none">${I.icon}</a><div><h2>${I.name}</h2><span class="n">${count(c)} recursos · <a href="${folderOf(c)}/index.html" style="color:var(--cc)">abrir página del apartado ↗</a></span></div></div>${gs.map(g=>groupHTML(g,I.name)).join('')}</section>`});
 html+='</main>';
}
html+='<div class="empty" id="empty">No hay ningún recurso con esa búsqueda. 🙈</div><footer>Recursos de aula · Lengua Castellana y Literatura</footer>';
app.innerHTML=html;
const q=document.getElementById('q'),cnt=document.getElementById('count');const all=document.querySelectorAll('.card').length;
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
function filter(){const v=norm(q.value.trim());let shown=0;
 document.querySelectorAll('.card').forEach(c=>{const ok=!v||norm(c.dataset.t).includes(v);c.classList.toggle('hide',!ok);if(ok)shown++});
 document.querySelectorAll('.group,div.feature').forEach(g=>g.classList.toggle('hide',!g.querySelector('.card:not(.hide)')));
 document.querySelectorAll('section.cat').forEach(s=>s.classList.toggle('hide',!s.querySelector('.card:not(.hide)')));
 const cb=document.getElementById('coursesBlock');if(cb)cb.classList.toggle('hide',!!v);
 document.getElementById('empty').style.display=shown?'none':'block';cnt.textContent=v?`${shown} resultado${shown===1?'':'s'}`:`${all} recursos`}
q.addEventListener('input',filter);filter();
})();
