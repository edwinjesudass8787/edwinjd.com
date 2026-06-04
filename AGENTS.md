# AI Agent Instructions — edwinjd.com

## Project Overview

This is a static personal portfolio website for Edwin Jesu Dass, hosted on GitHub Pages at `https://edwinjd.com`. It is built with plain HTML, CSS, and vanilla JavaScript — no build step, no frameworks.

## File Structure

```
edwinjd.com/
├── index.html              # Homepage: about, projects, Medium articles, contact
├── analyses.html           # "The Observatory" — gallery of sentiment analyses
├── rohingya-sentiment.html # Individual analysis page (charts, findings, comments)
├── swarm-governance.html   # DBA research proposal slide deck
├── styles.css              # Shared stylesheet — dark editorial theme
├── script.js               # Medium RSS feed parser + year auto-update
├── robots.txt              # Allows all crawlers
├── sitemap.xml             # Index of all pages
├── llms.txt                # AI-readable site overview
├── CNAME                   # GitHub Pages custom domain (edwinjd.com)
├── og-image.svg            # Open Graph image
└── AGENTS.md               # This file
```

## Design System

- **Fonts:** DM Sans (body), DM Mono (labels/meta), Fraunces (serif headings)
- **Palette:** `#0d0f14` background, `#141720` surface, `#1e2330` borders, `#d4d8e2` text, `#5a6070` muted, `#c4963a` gold accent
- **Cards:** 10px radius, solid dark surfaces, subtle shadow
- **Buttons:** Gold primary (`#c4963a`), ghost secondary
- **Responsive:** 3-col grid → 2-col → 1-col at 900px and 640px breakpoints

## Conventions

- All pages link `styles.css` and the same Google Fonts import
- All pages share the sticky `site-header` with nav: About, Projects, Analyses, Writing, Contact
- Footer auto-updates year via `document.getElementById('year').textContent = new Date().getFullYear()`
- Analysis pages have a `.backbar` linking back to `analyses.html`
- Chart.js is loaded per-page where needed (not globally)

## Adding a New Analysis

1. Create a new HTML page (e.g., `new-analysis.html`) following `rohingya-sentiment.html` as a template
2. Link `styles.css` and the Google Fonts import
3. Include the shared `site-header` nav
4. Add a `.backbar` linking to `analyses.html`
5. Add the page to `sitemap.xml`
6. Add a card to `analyses.html` in the `.analysis-grid`

## Hosting

- GitHub Pages with custom domain `edwinjd.com`
- CNAME file contains `edwinjd.com`
- Push to `main` branch to deploy
