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
- `partes`: divide la evaluación en partes (usado en PDC y en 1.º ESO). La primera parte lleva la lista cerrada de archivos ya examinados (`archivos`); la parte con `resto:true` recoge automáticamente todo lo demás, así que **los recursos nuevos de PDC y de 1.º ESO van solos a la segunda parte** (en 1.º ESO, dentro de sus apartados de siempre: hay que seguir añadiendo la ruta al apartado que toque). Al empezar una parte nueva, se pasan a la lista cerrada los archivos de la anterior.

**Publicar**
- Antes de subir: `git fetch` + `rebase` sobre `origin/main`, porque se trabaja desde varios chats.
- Mensajes de commit en castellano y descriptivos.

## 4. Enlaces de cada curso

- 1.º ESO: `https://ferramentas-osval.github.io/recursos-aula/01_ESO/`
- Bachillerato: `…/02_BACH/` · FP Básica: `…/03_FPB/` · PDC: `…/04_PDC/`
- Actividades lúdicas: `…/ACTIVIDADES_LUDICAS/` · Personajes históricos: `…/ACTIVIDADES_PERSONAJES_HISTORICOS/`
- Proyectos competenciales: `…/PROYECTOS_COMPETENCIALES/` · Talleres: `…/TALLERES_Y_TECNICAS_DE_ESTUDIO/`

## Botón «⌂ Panel»

Todo recurso nuevo (actividad, presentación, apuntes…) debe llevar antes de `</body>` el enlace `#volverPanel` (esquina inferior izquierda) que vuelve a la página de su apartado (`../…/0X_APARTADO/index.html`). Si el recurso se abrió en pestaña nueva, cierra la pestaña y vuelve al panel. Copiar el bloque de cualquier recurso existente.

## Soluciones protegidas con PIN y liberadas para todos

Algunos recursos (de momento, `01_ESO/1_Y_2/ACTIVIDADES/ficha_ortografia_1.html`) llevan las soluciones **cifradas** dentro del HTML (`window.__ENC`, AES-GCM con clave derivada del PIN del profesor y de la ruta del archivo). El candado 🔒 de la esquina pide el PIN y muestra los botones «Ver solución»; 🔓 las vuelve a ocultar.

Cuando el profesor pide **liberar las soluciones para todos**, no se vuelve a subir el recurso: se añade su clave a `assets/soluciones_liberadas.json` con
`node tools/liberar_soluciones.mjs <ruta del recurso> <PIN>` (o `--ocultar` para quitarla) y se hace commit. Cada recurso consulta ese JSON al abrirse (también desde el aula virtual o descargado, si hay internet); los cambios tardan unos minutos en verse por la caché de GitHub Pages.

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
