# Guía de la web «Recursos de aula»

Repositorio: **ferramentas-osval/recursos-aula** (GitHub Pages: `https://ferramentas-osval.github.io/recursos-aula/`)

Esta guía resume cómo está construida la web y cómo se mantiene. Cualquier chat con acceso al repositorio debe leerla antes de tocar nada.

## 1. Estructura

```
index.html                     ← portada (todos los cursos)
01_ESO/index.html              ← página de 1.º ESO
02_BACH/index.html             ← página de Bachillerato
03_FPB/index.html, 04_PDC/index.html, ACTIVIDADES_LUDICAS/index.html,
ACTIVIDADES_PERSONAJES_HISTORICOS/index.html, PROYECTOS_COMPETENCIALES/index.html,
TALLERES_Y_TECNICAS_DE_ESTUDIO/index.html   ← una página por curso o apartado
assets/recursos.css            ← diseño común (colores, tarjetas, cabeceras)
assets/recursos.js             ← motor que dibuja las páginas
assets/recursos_datos.js       ← LISTADO de recursos, novedades y ocultos
```

- Los `index.html` son casi vacíos: solo indican el modo (`home` o `course`) y cargan los tres archivos de `assets/`.
- **No se mueven ni se renombran** los HTML de los recursos: hay enlaces compartidos con el alumnado.
- La carpeta `01_ESO/1_Y_2/` conserva su nombre aunque la página es solo de 1.º ESO.

## 2. Diseño

- **Portada:** cabecera con degradado verde azulado, título «Recursos de aula», contadores, ilustración SVG propia (libro abierto, bocadillos, lápiz, estrellas flotando), ola inferior, buscador fijo y tarjetas grandes de colores, una por curso. Debajo, el listado completo.
- **Página de curso:** cabecera con el color e icono del curso, botón «← Todos los recursos», descripción, contadores, buscador propio, botones para saltar a cada bloque y tarjetas de recurso.
- **Tarjeta de recurso:** icono según el tipo (🎞️ presentación, ✏️ actividad, 📘 unidad didáctica, 🛠️ taller, 🎲 juego, 🕵️ expediente, 💬 tutoría), etiqueta del tipo, título y barra lateral del color del curso. La etiqueta amarilla «NUEVO» marca lo reciente.
- **Tipografías:** Bricolage Grotesque (títulos) y Atkinson Hyperlegible (texto). Texto justificado y a todo el ancho.
- **Colores por curso** (en `recursos.css`): `--c1` ESO verde azulado, `--c2` Bachillerato morado, `--c3` FPB naranja, `--c4` PDC verde, `--c5` lúdicas rosa, `--c6` personajes marrón, `--c7` proyectos azul, `--c8` talleres mostaza.
- Nombre, icono, color y descripción de cada curso: objeto `CATS` en `assets/recursos.js`.

## 3. Tareas habituales

**Subir un recurso nuevo**
1. Copiar el HTML a su carpeta, con el nombre en minúsculas, sin tildes ni ñ y con guiones bajos.
2. Añadir `{ "t": "Título visible", "h": "RUTA/archivo.html" }` en su sitio dentro de `window.RECURSOS` (`assets/recursos_datos.js`), en el orden en que debe aparecer.
3. Opcional: añadir su ruta a `window.NUEVOS` para que salga con la etiqueta «NUEVO».
4. Si el curso tiene organización a medida (`layout` en `CATS`, p. ej. 1.º ESO en Presentaciones, Tareas y Obras de lectura), añadir la ruta al apartado correspondiente.

**Ocultar o mostrar un recurso**
- Añadir o quitar su ruta (o una carpeta terminada en `/`) en `window.OCULTOS`.
- Con `?ver=todo` al final de la dirección, el profesor ve también lo oculto.
- Con `?alumnado` al final de la dirección, la página del curso no muestra el enlace a «Todos los recursos» (útil para dar a cada grupo solo su curso).

**Organizar un curso por temas** (`layout` dentro de su entrada en `CATS`)
- `apartados`: bloques con título, icono y lista de archivos concretos.
- `quitar`: niveles de carpeta que no se muestran en los títulos.
- `destacados` y `materias`: usados en PDC (horario y tutoría arriba, materias con icono y orden propio).
- `partes`: divide la evaluación en partes (usado en PDC y en 1.º ESO). La primera parte lleva la lista cerrada de archivos ya examinados (`archivos`); la parte con `resto:true` recoge automáticamente todo lo demás, así que **los recursos nuevos de PDC y de 1.º ESO van solos a la segunda parte** (en 1.º ESO, dentro de sus apartados de siempre: hay que seguir añadiendo la ruta al apartado que toque). Al empezar una parte nueva, se pasan a la lista cerrada los archivos de la anterior. En el panel, **la parte más reciente se muestra arriba** (también sus botones); con `partesOrden:'normal'` se mostrarían en orden.

**Publicar**
- Antes de subir: `git fetch` + `rebase` sobre `origin/main`, porque se trabaja desde varios chats.
- Mensajes de commit en castellano y descriptivos.

## 4. Enlaces de cada curso

- 1.º ESO: `https://ferramentas-osval.github.io/recursos-aula/01_ESO/`
- Bachillerato: `…/02_BACH/` · FP Básica: `…/03_FPB/` · PDC: `…/04_PDC/`
- Actividades lúdicas: `…/ACTIVIDADES_LUDICAS/` · Personajes históricos: `…/ACTIVIDADES_PERSONAJES_HISTORICOS/`
- Proyectos competenciales: `…/PROYECTOS_COMPETENCIALES/` · Talleres: `…/TALLERES_Y_TECNICAS_DE_ESTUDIO/`

## Contador «n / total» e ir a diapositiva (todas las presentaciones)

Toda presentación lleva antes de `</body>` el bloque de `tools/ir_a_diapositiva.html` (entre `<!--irdiapo:inicio-->` y `<!--irdiapo:fin-->`). Muestra **un único contador** «n / total» abajo a la izquierda, junto a «⌂ Panel». Al pulsarlo se abre encima un **selector pequeño** con un campo para escribir el número y la lista de diapositivas numeradas con su título. Se cierra con ✕, pulsando fuera, con Esc o pulsando otra vez el contador. Textos en gallego si `<html lang="gl">`, si no en castellano.

- **Sin contadores duplicados:** si la presentación tiene su propio contador (`#count`, `#contador`, `#ctr`…), se oculta con un bloque `<!--contador:inicio--><style>…{display:none!important}</style><!--contador:fin-->` justo antes del bloque anterior (no se toca el motor de la presentación).
- **Flechas anterior/siguiente en los laterales**, centradas en vertical. Si una presentación las tiene abajo, se pasan a los laterales en ese mismo bloque `contador`.
- Funciona con cualquier motor: detecta las diapositivas (`.slide`, `.diapo`, `[data-slide]`, `#stage > section`, o los arrays `slides`/`S`/`diapos`) y llega a la elegida simulando las flechas del teclado (si se atasca, prueba `goTo`/`go`/`ir`/`show`/`mostrar`).
- Para añadirlo o actualizarlo: copiar el bloque entero del archivo de `tools/`; si ya existe, sustituirlo (no duplicarlo).
- Desde la consola o desde otro script: `irADiapositiva(n)` (n empieza en 1).

## Aviso «🗺️ Esta teoría está resumida no esquema final» (todas las presentaciones con esquema final)

En la última diapositiva de cada bloque de teoría aparece abajo un aviso amarillo con el título del esquema y su número de diapositiva, un botón «Ir ao esquema →» / «Ir al esquema →» y ✕ para cerrarlo. En la diapositiva del esquema, el mismo aviso ofrece «↩ Volver á/a la diapositiva N».

- Bloque en `tools/aviso_esquema.html` (entre `<!--avisoesq:inicio-->` y `<!--avisoesq:fin-->`), **después** del bloque «Ir a diapositiva», que necesita. Antes del bloque va la configuración propia de cada presentación:
  `<script>window.AVISO_ESQUEMA={"lingua":"gl","avisos":[{"diapo":6,"esquema":24,"titulo":"Galicia na Idade Media"}]};</script>`
  (`lingua` `gl` o `es`, según la lengua de la presentación; diapositivas numeradas desde 1; opcional `"marxe":96` para subir el aviso si la presentación tiene una barra propia abajo).
- El aviso se puede **arrastrar** (asa ⠿) a cualquier sitio de la pantalla (la posición se mantiene durante la sesión) y **minimizar** (▁) a un botón redondo 🗺️ que, al pulsarlo, lleva al esquema (en el esquema es ↩ y devuelve a la diapositiva). El minimizado queda guardado en ese navegador.
- Si el aviso tapa contenido, la diapositiva se reduce un poco desde arriba mientras se ve el aviso (o se le deja el hueco con la clase `con-aviso`, como en Galicia na Idade Media).
- Para añadirlo o actualizarlo: copiar el bloque entero de `tools/`; si ya existe, sustituirlo (no duplicarlo).
- **Norma fija:** toda presentación nueva con esquema final lo lleva. No lo llevan las que no tienen esquema ni resumen final.

## Botón «⌂ Panel»

Todo recurso nuevo (actividad, presentación, apuntes…) debe llevar antes de `</body>` el enlace `#volverPanel` (esquina inferior izquierda) con `href` a la página de su apartado (`../…/0X_APARTADO/index.html`). **Copiar el bloque entero, con su `onclick`, de cualquier recurso existente (p. ej. `04_PDC/PRESENTACIONES/HISTORIA/presentacion_arte_renacentista.html`); no escribirlo a mano.**

Cómo funciona (pensado para el aula virtual, donde los enlaces a veces se abren en la misma ventana y no hay botón «atrás»):
- Cada panel de curso guarda en el navegador su dirección exacta, incluido `?alumnado`, y la posición del scroll.
- Al pulsar «⌂ Panel»: si el recurso se abrió en pestaña nueva, la cierra y vuelve a la del panel; si se abrió en la misma ventana, vuelve atrás al panel en el mismo sitio; si se abrió directamente (sin pasar por el panel), va al último panel visitado de ese curso o, si no hay ninguno, al `href`.

## Candado de soluciones 🔒 (todos los recursos con soluciones, ejemplos o panel del profesor)

Todo recurso con soluciones, ejemplos o panel del profesor lleva antes de `</body>` el bloque `<!--candado:inicio-->…<!--candado:fin-->`, generado con `tools/candado.py` a partir de `tools/candado_soluciones.html`. **No se escribe a mano.**

- 🔒 pequeño, casi transparente (opacidad 25 %), fijo abajo a la derecha; se ve más al pasar el ratón. Al pulsarlo se abre encima una ventana pequeña con el campo de código (con 👁 para ver lo escrito) y el botón «Abrir». **Código: `eclipse`.**
- Al acertar: 🔓 sobre círculo verde y aviso pequeño «Soluciones desbloqueadas» que se va solo. Pulsando otra vez, se vuelve a bloquear. Con el candado cerrado no se ven soluciones ni ejemplos. El candado y el aviso no se imprimen.
- **Cifrado:** el contenido de los elementos indicados con `--cifrar` (y los atributos de `--cifrar-atr`) se guarda cifrado en el propio HTML (AES-GCM, clave PBKDF2 del código y de la ruta del archivo); en el código fuente quedan vacíos. Lo que la página genera por JavaScript (p. ej. el reto de comunicación) solo se oculta.
- Uso: `python3 tools/candado.py <ruta.html> --cifrar ".solution;details.filmsol" --config "{ocultar:'.solbtn, .solution'}"`. `ocultar` = selectores que no se ven con el candado cerrado; opcionales `css` (ajustes de posición), `alCambiar(abierto)` y, en los recursos con su propio cifrado antiguo (`window.__ENC`), `abrir(código)`, `cerrar()` y `liberado(clave)`. La configuración queda guardada en el archivo: para actualizar el bloque basta con `python3 tools/candado.py <ruta.html>` (si se edita una solución cifrada, primero `--quitar`, editar y volver a ejecutar).
- Llevan candado: 1.º ESO, PDC y Talleres y técnicas de estudio (ver abajo qué no lo lleva).
- Presentación extra de Batman y Robin: entera con PIN (es solo para el profesor), sin cambios.

### Liberar las soluciones para todos

**Desde el propio recurso (lo normal):** con el candado abierto con el código aparece al lado el botón «🌐 Liberar para todos» (en gallego, según el idioma del recurso). Tras confirmar, el recurso envía su clave a la aplicación web de Apps Script de la cuenta ferramentas.osval@gmail.com (`tools/apps_script_liberar_soluciones.gs`), que la añade a `assets/soluciones_liberadas.json` con un commit. Con el recurso liberado, el botón pasa a «🌐 Ocultar para todos». El alumnado lo ve en unos minutos (caché de GitHub Pages).
- La URL de la aplicación web va en `assets/candado_config.json` (`liberar_url`). Si está vacía, el botón no aparece.
- Propiedades del script: `GITHUB_TOKEN` (token fine-grained solo para este repositorio, permiso Contents: lectura y escritura), `CODIGO` (el código del candado) y `REPO` (`ferramentas-osval/recursos-aula`). El token nunca va en los HTML.
- Con el recurso liberado, el 🔒 sigue visible pero discreto: el profesor lo abre con el código para ver el botón «Ocultar para todos».
- **Etiqueta «✅ Con soluciones» en el panel (automática, en todos los cursos y apartados):** `assets/recursos.js` lee `assets/soluciones_liberadas.json` y la pone debajo del título de la tarjeta de cada recurso liberado, en la portada y en las páginas de curso. Al ocultarlo para todos, desaparece. No hay que añadir nada a mano: basta con que el recurso tenga tarjeta en el panel (`recursos_datos.js`) y esté en la lista.

**A mano (alternativa):** `node tools/liberar_soluciones.mjs <ruta del recurso> eclipse` (o `--ocultar` para quitarla) y commit.

**Modelos de examen:** llevan candado y el profesor los libera cuando quiere (1.º ESO y PDC). En el panel ya no se titulan «resuelto»: la etiqueta «✅ Con soluciones» indica cuándo están liberados. En el de PDC, las formas rodeadas (`i.circle`) tampoco están en el código: sus posiciones van cifradas en `template#cdCirculos` y se repintan al abrir.

**Sin candado (decidido):** apuntes y esquemas; prácticas y juegos autocorregibles (`reto_substantivo_…`, sujeto y complementos, práctica y prueba de comunicación, vocabulario); prompts y presentaciones sin soluciones.
- `04_PDC/ACTIVIDADES/ejercicios_tipos_frases.html` sí lleva candado: las prácticas A, B y C siguen corrigiéndose solas, y además tienen «Ver solución» (oculto y cifrado) que abre la solución completa en la ventana grande.

## Botón «🖨️ Imprimir»

Solo las fichas (no las presentaciones) llevan arriba un botón para imprimirlas sin soluciones ni botones. Las fichas se maquetan en hojas A4 (`.page`, 210 × 297 mm) que se reparten solas al mostrar u ocultar soluciones; ejemplo: `01_ESO/1_Y_2/ACTIVIDADES/ficha_ortografia_1.html`.

## Esquemas de PDC (uno por cada parte de la evaluación)

- Carpeta `04_PDC/ESQUEMAS/`, un archivo por parte: `esquemas_1a_evaluacion_primera_parte.html`, `esquemas_1a_evaluacion_segunda_parte.html`… En el panel salen en el subapartado «🗺️ Esquemas» de su parte.
- Se actualizan cuando el profesor lo pida, a partir del esquema final de cada presentación. Un bloque por materia (Lengua, Galego, Xeografía, Historia), cada materia en su lengua.
- **Mismo diseño siempre**: copiar la plantilla de `esquemas_1a_evaluacion_primera_parte.html` (raíz de color de la materia, ramas de colores con conectores, ejemplos en letra manuscrita de color dentro de una etiqueta suave, sin bordes discontinuos, «Recuerda/Lembra» al final). Alumnado con dificultades: frases cortas, muchos ejemplos.
- Botón «🖨️ Imprimir» (todo, una materia o «Solo este»); cada esquema se ajusta solo a una hoja A4.
- **Norma fija:** cada vez que se suba una presentación nueva de PDC, se añade también su esquema (a partir del esquema final de la presentación) al archivo de esquemas de la parte en curso, en el bloque de su materia, y se actualiza el índice de arriba. Comprobar que cada esquema sigue cabiendo en una hoja A4 al imprimir.

## Esquemas de 1.º ESO (uno por cada parte de la evaluación)

- Carpeta `01_ESO/1_Y_2/ESQUEMAS/`, un archivo por parte: `esquemas_1a_evaluacion_primera_parte_1eso.html`, `esquemas_1a_evaluacion_segunda_parte_1eso.html`… Cabecera «1.º ESO · Lengua castellana y literatura». En el panel salen en el apartado «🗺️ Esquemas» (último del `layout` de 1.º ESO en `assets/recursos.js`), dentro de cada parte.
- **Misma plantilla que PDC**, sin tocar el CSS ni el script de impresión: se copia la cabecera y el CSS de `04_PDC/ESQUEMAS/esquemas_1a_evaluacion_primera_parte.html` y el botón «⌂ Panel» apunta a `../../../01_ESO/index.html`.
- **Un esquema por presentación**, a partir de su esquema final (si no lo tiene, de su teoría). Bloques por apartados, solo los que tengan contenido, con los colores de materia del CSS: `m-galego` (azul) = Comunicación y textos · `m-lengua` (rojo) = Lenguaje y lengua. Lenguas del mundo y de España · `m-xeo` (verde) = Ortografía y vocabulario · `m-hist` (marrón) = Literatura y lecturas. Cada bloque tiene su botón en la barra, su recuadro en el índice y su opción en el menú de impresión (`data-mat`: `comunicacion`, `lengua`, `ortografia`, `literatura`).
- Alumnado con dificultades: frases cortas y muchos ejemplos; raíz de color, ramas con conectores, ejemplos en letra manuscrita dentro de una etiqueta suave y «💡 Recuerda» al final. Terminología del profesor: «frase» (nunca «sintagma»), clases de palabras en minúscula, «f. nominal», «f. preposicional»…
- Botón «🖨️ Imprimir» (todo, un apartado o «Solo este»); cada esquema en una sola hoja A4. Comprobar con Playwright que el PDF tiene tantas páginas como esquemas, sin errores en consola y que se ve bien en el móvil.
- **Norma fija:**
  1. Cada vez que se suba una presentación nueva de 1.º ESO, se añade su esquema al archivo de esquemas de la parte en curso, en el bloque de su apartado, y se actualizan el índice, la barra y el menú de impresión si el bloque es nuevo.
  3. **Orden:** los bloques y los esquemas van en el mismo orden en que salen las presentaciones en los apartados del panel de 1.º ESO (primero «Presentaciones temas lengua» por temas, después «Ortografía y vocabulario» y al final «Obras de lectura»), y se numeran seguidos del 1 en adelante.
  2. Cuando empiece una parte nueva, se crea su archivo de esquemas (`esquemas_1a_evaluacion_tercera_parte_1eso.html`, `esquemas_2a_evaluacion_primera_parte_1eso.html`…), se registra en `assets/recursos_datos.js`, en `NUEVOS` y en el apartado «Esquemas» del `layout`, y el archivo de la parte que termina pasa a la lista cerrada de su parte.

## Esquemas y apuntes de FPB

- Archivo único de la evaluación: `03_FPB/ESQUEMAS/esquemas_1a_evaluacion_fpb.html` (cabecera «1.º FPB · Comunicación y ciencias sociales I», título «🗺️ Esquemas · 1.ª evaluación»). En `assets/recursos_datos.js` está en la carpeta «ESQUEMAS Y APUNTES EXAMEN» de «03. FPB», después de PRESENTACIONES y ACTIVIDADES; el motor la muestra sola como apartado «Esquemas y apuntes examen» dentro de «1ª evaluación» (FPB no necesita `apartados` en `CATS`). Los apuntes o modelos de examen de FPB van también en esa carpeta.
- **Misma plantilla que 1.º ESO**, sin tocar el CSS ni el script de impresión (copiados de `01_ESO/1_Y_2/ESQUEMAS/esquemas_1a_evaluacion_primera_parte_1eso.html`); el botón «⌂ Panel» apunta a `../../03_FPB/index.html`.
- **Bloques** (solo los que tengan contenido), en este orden y con los colores de materia del CSS: `m-galego` (azul) = Comunicación y textos · `m-hist` (marrón) = Ciencias sociales · `m-xeo` (verde) = Lengua y ortografía (siempre al final). Cada bloque tiene su botón en la barra (texto corto: «💬 Comunicación», «🌍 Sociales», «🔤 Ortografía»), su recuadro en el índice y su opción en el menú de impresión (`data-mat`: `comunicacion`, `ortografia`, `sociales`).
- **Un esquema por presentación visible** (no las de `OCULTOS` ni la de evaluación inicial de la primera semana en el taller), a partir de su esquema final o, si no lo tiene, de su teoría, revisando también su ficha de actividades. Si una presentación trabaja contenidos de dos bloques (p. ej., comunicación + ortografía, o carta de reclamación + historia), su parte de cada bloque va como esquema propio en ese bloque, para que cada uno quepa en una hoja A4 y se lea con claridad.
- **Orden:** los bloques van en el orden de arriba y, dentro de cada uno, los esquemas siguen el orden de las presentaciones en el panel de FPB; numeración seguida del 1 en adelante.
- Estilo: alumnado con dificultades; frases cortas y muchos ejemplos del taller y de los coches; raíz de color, ramas con conectores, ejemplos en letra manuscrita dentro de una etiqueta suave y «💡 Recuerda» al final. Terminología del profesor: «frase» (nunca «sintagma»), clases de palabras en minúscula, «f. nominal», «f. preposicional»…
- Botón «🖨️ Imprimir» (todo, un bloque o «Solo este»); cada esquema en una sola hoja A4. Comprobar con Playwright que el PDF tiene tantas páginas como esquemas, sin errores en consola y sin desbordar a 390 px en el móvil.
- **Norma fija:** cada vez que se suba una presentación nueva de FPB, se añade su esquema a este archivo, en el bloque que le corresponda y en el orden del panel; se renumeran los siguientes (el esquema general «Pautas de redacción» va siempre el último, en su propio apartado azul, después de Lengua y ortografía; se imprime con Comunicación y textos) y se actualizan el índice, la barra y el menú de impresión si el bloque es nuevo.
