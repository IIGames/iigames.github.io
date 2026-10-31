# II Games website

Static website for GitHub Pages. Deploy the committed HTML, CSS, JavaScript, and assets as before. No production dependencies or build service are required.

For a local preview, run `node tools/serve.mjs` and open `http://127.0.0.1:4173`. Site links use clean, extensionless URLs on GitHub Pages; local links resolve to `.html` files so they also work with VS Code Live Server. Direct links such as `games/cubegame.html` work too; `game.html?game=CubeGame` is a local shortcut.

Edit `games/catalog.json` to change game details, media, credits, and verified platform links. Then run:

```sh
node tools/build-site.mjs
node tools/validate-site.mjs
```

The builder also generates page-specific SEO metadata, `robots.txt`, and `sitemap.xml`. The canonical site origin is configured in `tools/build-site.mjs`.

The builder keeps game pages as real HTML, including when JavaScript is disabled. `news/article.html` is the preserved article body used by the builder. Existing source artwork remains in `assets`; delivered images are in `assets/optimized`.

`tools/optimize-assets.ps1` can resize new catalog images using Windows System.Drawing. It preserves original media and writes JPEG variants plus a small PNG logo. Use this before rebuilding when adding new images.

Design and product context are in `DESIGN.md` and `PRODUCT.md`. Browser verification artifacts are ignored under `output/playwright`.
