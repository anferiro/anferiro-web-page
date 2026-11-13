# anferiro.me

Sitio personal de Andres Rincon. Next.js (static export) publicado en S3 + CloudFront.

## Estructura

- `src/app/`: layout, página y estilos globales.
- `src/components/`: secciones de la página.
- `src/data/`, `src/i18n/`: contenido y traducciones.
- `public/`: assets estáticos (imágenes, artículos HTML, robots, sitemap, CNAME).
- `scripts/publish.py`: conversor Obsidian → HTML del sitio anterior.
- `legacy-static/`: sitio anterior y su documentación, solo como referencia.
- `.github/workflows/deploy.yml`: build y deploy.

## Desarrollo

```bash
npm ci
npm run dev     # http://localhost:3000
npm run build   # genera ./out
```
