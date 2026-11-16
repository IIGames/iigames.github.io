# Repository instructions

## News article gradients

- Every new news article must use a new, visually distinct cover gradient that has not appeared in an earlier article. Prefer creating a new preset over reusing one; do not fall back to the category default.
- Only when no more distinct new gradients are available may an existing gradient be reused. In that case, choose a gradient that differs from every gradient used by the previous 20 news articles (or all previous articles if there are fewer than 20), ordered by publication date. If none qualifies, create a new gradient rather than violate this spacing rule.
- Register new presets in `tools/news.mjs` (`gradientPresets`), define their `.gradient-<name>` styles in `news.css`, and select the preset explicitly in the article's `cover.gradient` in `news/catalog.json`.
- Run `npm run build` and `npm run validate` after changing news content or gradient presets so generated articles, archive cards, related articles, and the sitemap stay current.
