# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Bonita Documentation Theme - an Antora UI bundle used by the [bonita-documentation-site](https://github.com/bonitasoft/bonita-documentation-site) repository. It's based on the [Antora Default UI](https://gitlab.com/antora/antora-ui-default) and produces a `ui-bundle.zip` for Antora to consume.

## Development Commands

```bash
# Install dependencies (Node 18 required, use `nvm use`)
npm install

# Development preview
npm run dev              # Static preview at http://localhost:5252
npm run devlive          # Preview with live reload (may require browser restart)

# Build for production
npm run bundle           # Creates ui-bundle.zip in build/

# Showroom (test theme in real Antora context)
npm run build:showroom   # Build showroom site
npx http-server ./site/build  # Serve the built showroom

# Linting
gulp lint                # Lint JavaScript
gulp lint:scss           # Lint SCSS (disabled in main lint task)
gulp format              # Format JavaScript with Prettier
```

## Architecture

### Build System
- **Gulp-based**: `gulpfile.js` orchestrates the build, with task implementations in `gulp.d/tasks/`
- **SCSS**: Processed via `gulp-sass` and PostCSS with autoprefixer
- **JavaScript**: Bundled via Browserify, uglified for production
- **Assets**: Images optimized with imagemin in production builds

### Source Structure (`src/`)
- `layouts/` - Handlebars page layouts (default.hbs, 404.hbs)
- `partials/` - Handlebars partial templates (header, footer, nav, toc, etc.)
- `helpers/` - Handlebars helper functions
- `stylesheets/` - SCSS files, entry point is `site.scss`
- `js/` - JavaScript files, numbered prefix determines concatenation order (e.g., `02-on-this-page.js`)
- `img/` - SVG icons and images

### Theming (Light/Dark Mode)
Colors are defined as CSS custom properties in `src/stylesheets/globals/vars.scss`:
- Light theme: `:root` selector (lines 1-186)
- Dark theme: `html[data-theme='dark']` selector (lines 189-252)

To add a new color:
1. Add `--color-XXX` in the light color set
2. Add `--color-XXX` in the dark color set
3. Use it with `var(--color-XXX)` in CSS

### Preview System
- `preview-src/` contains sample AsciiDoc pages for testing the theme
- `preview-src/ui-model.yml` defines the UI model for preview builds

## Integration

The theme integrates:
- **DocSearch**: Algolia search via `@docsearch/js`
- **Font Awesome**: Icons via `@fortawesome/fontawesome-free`
- **Asciidoctor Tabs**: Tab component support

## Release Process

Automated via GitHub Actions - running the `create-tag.yml` workflow will:
1. Create a new tag
2. Generate and release `ui-bundle.zip`
3. Trigger a PR in bonita-documentation-site with the updated bundle URL
