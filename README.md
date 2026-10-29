# II Games website

Static website for GitHub Pages. Deploy the committed HTML, CSS, JavaScript, and assets as before. No production dependencies or build service are required.

For a local preview, run `node tools/serve.mjs` and open `http://127.0.0.1:4173`. The Games links use `game.html` locally. Direct links such as `Games/CubeGame.html` work too; `game.html?game=CubeGame` is a local shortcut.

Edit `Games/catalog.json` to change game details, media, credits, and verified platform links. Then run:

```sh
node tools/build-site.mjs
node tools/validate-site.mjs
```

The builder keeps game pages as real HTML, including when JavaScript is disabled. `News/article.html` is the preserved article body used by the builder. Existing source artwork remains in `Assets`; delivered images are in `Assets/optimized`.

`tools/optimize-assets.ps1` can resize new catalog images using Windows System.Drawing. It preserves original media and writes JPEG variants plus a small PNG logo. Use this before rebuilding when adding new images.

Design and product context are in `DESIGN.md` and `PRODUCT.md`. Browser verification artifacts are ignored under `output/playwright`.
