# ALCOBA

ALCOBA es un proyecto web estático de indumentaria inspirado en paisajes, arquitectura y culturas del invierno.

## URL
https://alcoba.netlify.app/

## Páginas

- `index.html`: página principal.
- `pages/collections.html`: colecciones de la marca.
- `pages/shop.html`: tienda y listado de productos.
- `pages/journal.html`: contenido editorial.
- `pages/about.html`: información sobre la marca.

## Tecnologías utilizadas

- HTML5
- SCSS
- CSS3
- Bootstrap 5
- Bootstrap Icons
- Google Fonts
- AOS (Animate On Scroll)

## Organización de estilos

El proyecto usa SCSS dividido en parciales para mantener el código ordenado:

- `abstracts`: variables y mixins.
- `base`: reset y estilos generales.
- `layout`: navegación, hero, manifiesto y footer.
- `components`: encabezados de sección, tarjetas, categorías, journal y newsletter.
- `pages`: estilos específicos de páginas internas (colecciones, about, journal y tienda).

Hay dos tipos de hero:

- `.hero`: hero principal del home.
- `.page-hero`: hero reutilizable para páginas internas.

Los parciales se compilan a `styles/main.css` (con source map) usando Sass.

## Cómo ver el proyecto

Abrir `index.html` en el navegador. Desde ahí se puede navegar hacia el resto de las páginas.

Para modificar los estilos, instalar las dependencias y compilar el SCSS:

```bash
npm install
npm run build   # compila una vez
npm run watch   # recompila automáticamente al guardar cambios
```

## Notas

El sitio conserva una estructura simple porque es un proyecto académico estático. No utiliza JavaScript propio; solo carga los bundles de Bootstrap (menú responsive) y AOS (animaciones al hacer scroll), ambos vía CDN.
