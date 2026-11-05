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

Algunos recursos (de momento, `01_ESO/1_Y_2/ACTIVIDADES/ortografia_por_que_tiene_que_ser_todo_tan_dificil.html`) llevan las soluciones **cifradas** dentro del HTML (`window.__ENC`, AES-GCM con clave derivada del PIN del profesor y de la ruta del archivo). El candado 🔒 de la esquina pide el PIN y muestra los botones «Ver solución»; 🔓 las vuelve a ocultar.

Cuando el profesor pide **liberar las soluciones para todos**, no se vuelve a subir el recurso: se añade su clave a `assets/soluciones_liberadas.json` con
`node tools/liberar_soluciones.mjs <ruta del recurso> <PIN>` (o `--ocultar` para quitarla) y se hace commit. Cada recurso consulta ese JSON al abrirse (también desde el aula virtual o descargado, si hay internet); los cambios tardan unos minutos en verse por la caché de GitHub Pages.

## Botón «🖨️ Imprimir»

Solo las fichas (no las presentaciones) llevan arriba un botón para imprimirlas sin soluciones ni botones.
