# ALCOBA

ALCOBA es un proyecto web estático de indumentaria inspirado en paisajes, arquitectura y culturas del invierno.

## URL
https://jonnschenk.github.io/Alcoba/

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
- JavaScript (vanilla)

## Organización de estilos

El proyecto usa SCSS dividido en parciales para mantener el código ordenado:

- `abstracts`: variables y mixins.
- `base`: reset y estilos generales.
- `layout`: navegación, hero, manifiesto y footer.
- `components`: encabezados de sección, tarjetas, categorías, journal y newsletter.
- `pages`: estilos específicos de páginas internas (colecciones, about, journal y tienda).

Cada página tiene su propio hero, con estilos específicos en su parcial de `pages`:

- `.hero`: hero principal del home (`layout/_hero.scss`).
- `.about-hero`: hero de `about.html`.
- `.collections-hero`: hero de `collections.html`, con índice de capítulos.
- `.journal-hero`: hero de `journal.html`.
- `.shop-hero`: hero de `shop.html`.

Los parciales se compilan a `styles/main.css` (con source map) usando Sass.

## Organización de scripts

El proyecto incluye JavaScript propio en `scripts/`:

- `cart.js`: carrito de compras (guardado en `localStorage`, render de items, subtotal y contador).
- `search.js`: overlay de búsqueda (abrir/cerrar, foco automático, cierre con Escape o click afuera).
- `shop-filter.js`: filtrado, búsqueda y orden de productos en la tienda (`shop.html`).

## Cómo ver el proyecto

Abrir `index.html` en el navegador. Desde ahí se puede navegar hacia el resto de las páginas.

Para modificar los estilos, instalar las dependencias y compilar el SCSS:

```bash
npm install
npm run build   # compila una vez
npm run watch   # recompila automáticamente al guardar cambios
```

## Notas

El sitio conserva una estructura simple porque es un proyecto académico estático. Además de los bundles de Bootstrap (menú responsive) y AOS (animaciones al hacer scroll), ambos vía CDN, utiliza JavaScript propio en `scripts/` para el carrito, la búsqueda y el filtrado de la tienda.
