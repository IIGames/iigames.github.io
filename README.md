# II Games website

Static website for GitHub Pages. Deploy the committed HTML, CSS, JavaScript, and assets as before. No runtime backend or build service is required. Node and the development dependency are used locally to turn the catalogs and Markdown into committed static output.

Install the locked development dependency before the first build:

```sh
npm ci
npm run build
npm run validate
npm test
npm run preview
```

Preview at `http://127.0.0.1:4173`. `npm run build` regenerates HTML, page metadata, `robots.txt`, and `sitemap.xml`; `npm run validate` checks the generated site and repeatable builds; `npm test` checks the news data contract and Markdown renderer. The canonical site origin is configured in `tools/build-site.mjs`.

Site links use clean, extensionless URLs on GitHub Pages; local links resolve to `.html` files so they also work with VS Code Live Server. Direct links such as `games/cubegame.html` work too; `game.html?game=CubeGame` is a local shortcut.

## Game authoring

Edit `games/catalog.json` to change game details, media, credits, and verified platform links. Rebuild and validate before committing the catalog and generated files. Game pages remain real HTML with JavaScript disabled.

Existing source artwork remains in `assets`; delivered images are in `assets/optimized`. `tools/optimize-assets.ps1` can resize new catalog images using Windows System.Drawing. It preserves original media and writes JPEG variants plus a small PNG logo. Use this before rebuilding when adding new images.

## News authoring

`news/catalog.json` is a JSON array of article objects. Add a record, rebuild, validate, and commit the catalog, any Markdown or image files, and generated output. Every record generates `news/<slug>.html`, a card in `news.html`, article metadata and structured data, and a canonical sitemap entry. Publication happens when the committed static files are deployed; dates do not schedule or hide articles.

| Field | Contract |
| --- | --- |
| `slug` | Unique lowercase letters or digits with single hyphens between words. `article` and `index` are reserved. Keep published slugs stable. |
| `title` | Nonempty article title. |
| `date` | Real calendar date in `YYYY-MM-DD` format. |
| `category` | `game-releases`, `development`, or `studio`. |
| `summary` | An introduction of at least 50 characters, also used for the metadata description. |
| `author` | Optional nonempty text; defaults to `II Games`. |
| `cover` | Optional object containing exactly one of `image` or `gradient`. Images need `alt`. |
| `body` or `bodyFile` | Exactly one nonempty Markdown source. `bodyFile` names an existing `.md` file relative to the `news` directory. |

For a short post, add an object like this to the array. JSON `\n` escapes become Markdown newlines; keep blank lines between paragraphs and headings.

```json
{
  "slug": "prototype-notes",
  "title": "Prototype notes",
  "date": "2026-11-05",
  "category": "development",
  "summary": "Notes on the prototype, the controls we are testing and what comes next.",
  "cover": { "gradient": "iris" },
  "body": "We are testing a small prototype.\n\n## What comes next\n\nRead more [about II Games](/about)."
}
```

For a longer post, keep the Markdown in a separate file. This example uses an existing image; write `news/posts/level-notes.md` before building.

```json
{
  "slug": "level-notes",
  "title": "Level notes",
  "date": "2026-11-05",
  "category": "game-releases",
  "summary": "A closer look at CubeGame’s platforms and the tools used to move through a level.",
  "author": "II Games",
  "cover": {
    "image": "assets/optimized/CubeGame-cover.jpg",
    "alt": "The glowing cube and purple forest platforms in CubeGame"
  },
  "bodyFile": "posts/level-notes.md"
}
```

Cover image paths are site-relative, without a leading slash, and must name existing PNG, JPEG, WebP, or AVIF files with matching filename case. Gradient presets are `sky`, `iris`, and `ember`. Omitting `cover` selects the category default: sky for game releases, iris for development, and ember for studio.

Markdown supports paragraphs, emphasis, lists, blockquotes, fenced code, and tables. The article title provides the only `h1`; body headings start at `h2`, and a Markdown `#` heading is rendered as `h2`. Raw HTML is escaped. Tables and code blocks scroll within the article when needed.

Use root-relative site links such as `[Games](/games)` and images such as `![CubeGame artwork](/assets/optimized/CubeGame-cover.jpg "CubeGame artwork")`. The image title becomes a visible caption; alt text describes the image. These paths resolve from the site root even when the Markdown file is in `news/posts`. Local images must exist; external HTTPS links and images are also supported. Do not use filesystem paths or unsafe URL schemes.

The archive starts newest first, with category filters and oldest/newest sorting when JavaScript is available. Articles include reading time, an author, related posts, and a copy-link control with a selectable-link fallback. Without JavaScript, all article cards and article content remain readable.

The original `/news/1` route is preserved by the record with slug `1`. `news/article.html` is retained as a legacy content reference, not the authoring source for generated articles. Do not edit generated article HTML to change a post. Removing a catalog record does not delete its old generated HTML: remove that specific `news/<slug>.html` file manually and check inbound links before committing. Renaming a published slug likewise requires handling the old URL explicitly.

Design and product context are in `DESIGN.md` and `PRODUCT.md`. Browser verification artifacts are ignored under `output/playwright`.
