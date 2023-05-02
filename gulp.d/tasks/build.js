'use strict'

const browserify = require('browserify')
const concat = require('gulp-concat')
const fs = require('fs-extra')
const imagemin = require('gulp-imagemin')
const merge = require('merge-stream')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const vfs = require('vinyl-fs')
const sass = require('gulp-sass')(require('sass'))
const ospath = require('path')
const path = ospath.posix
const postcssUrl = require('postcss-url')
const { Transform } = require('stream')
const map = (transform) => new Transform({ objectMode: true, transform })
const through = () => map((file, enc, next) => next(null, file))

const config = {
  libsJs: [
    'node_modules/@docsearch/js/dist/umd/index.js',
    'node_modules/asciinema-player/dist/bundle/asciinema-player.min.js',
  ],
  libsCss: [
    'node_modules/@docsearch/css/dist/style.css',
    'node_modules/asciinema-player/dist/bundle/asciinema-player.css',
    'node_modules/@fortawesome/fontawesome-free/css/all.css',
  ],
  libsFonts: [
    'node_modules/@fortawesome/fontawesome-free/webfonts/*.{ttf,woff*(2)}',
  ]
}

module.exports = (src, dest, preview) => () => {
  const opts = { base: src, cwd: src }
  const sourcemaps = preview || process.env.SOURCEMAPS === 'true'
  const autoprefixer = require('autoprefixer')
  const postcssPlugins = [require('@csstools/postcss-sass'),
    autoprefixer(),
    postcssUrl({
      filter: '**/~typeface-*/files/*',
      url: (asset) => {
        const relpath = asset.pathname.substr(1)
        const abspath = require.resolve(relpath)
        const basename = ospath.basename(abspath)
        const destpath = ospath.join(dest, 'font', basename)
        if (!fs.pathExistsSync(destpath)) fs.copySync(abspath, destpath)
        return path.join('..', 'font', basename)
      },
    }),
    postcssUrl({
      filter: '**/open-sans/**',
      url: (asset) => {
        const relpath = 'open-sans-fonts/' + asset.pathname.substr(1)
        const abspath = require.resolve(relpath)
        const basename = ospath.basename(abspath)
        const destpath = ospath.join(dest, 'font', basename)
        if (!fs.pathExistsSync(destpath)) fs.copySync(abspath, destpath)
        return path.join('..', 'font', basename)
      },
    })]

  /**
   * Aggregate js lib
   */
  function libJs () {
    const { src } = require('gulp')
    return src(config.libsJs)
      .pipe(concat('js/vendor/libs.js'))
  }

  /**
   * Copy custom fonts
   */
  function libFonts () {
    return vfs.src(config.libsFonts)
      .pipe(vfs.dest(`${dest}/stylesheets/webfonts`))
  }

  /**
   * Aggregate css files
   */
  function libCss () {
    const { src } = require('gulp')
    return src(config.libsCss)
      .pipe(concat('stylesheets/vendor/libs.css'))
  }

  const buffer = require('vinyl-buffer')
  function scss () {
    return vfs
      .src('stylesheets/site.scss', { ...opts, sourcemaps })
      .pipe(sass({
        includePaths: ['node_modules/open-sans-fonts'],
      }))
      .pipe(postcss(postcssPlugins))
  }
    merge(
    libJs(),
    libCss(),
    scss(),
    vfs
      .src('js/+([0-9])-*.js', { ...opts, sourcemaps })
      .pipe(uglify())
      // NOTE concat already uses stat from newest combined file
      .pipe(concat('js/site.js')),
    vfs
      .src('js/header-+([0-9])-*.js', { ...opts, sourcemaps })
      .pipe(uglify())
      // NOTE concat already uses stat from newest combined file
      .pipe(concat('js/header-site.js')),
    vfs
      .src(['js/vendor/*([^.])?(.bundle).js', '!js/vendor/*.min.js'], { ...opts, read: false })
      .pipe(
        // see https://gulpjs.org/recipes/browserify-multiple-destination.html
        map((file, enc, next) => {
          if (file.relative.endsWith('.bundle.js')) {
            const mtimePromises = []
            const bundlePath = file.path
            browserify(file.relative, { basedir: src, detectGlobals: false })
              .plugin('browser-pack-flat/plugin')
              .on('file', (bundledPath) => {
                if (bundledPath !== bundlePath) mtimePromises.push(fs.stat(bundledPath).then(({ mtime }) => mtime))
              })
              .bundle((bundleError, bundleBuffer) =>
                Promise.all(mtimePromises).then((mtimes) => {
                  const newestMtime = mtimes.reduce((max, curr) => (!max || curr > max ? curr : max))
                  if (newestMtime > file.stat.mtime) file.stat.mtimeMs = +(file.stat.mtime = newestMtime)
                  if (bundleBuffer !== undefined) file.contents = bundleBuffer
                  file.path = file.path.slice(0, file.path.length - 10) + '.js'
                  next(bundleError, file)
                })
              )
          } else {
            fs.readFile(file.path, 'UTF-8').then((contents) => {
              file.contents = Buffer.from(contents)
              next(null, file)
            })
          }
        })
      )
      .pipe(buffer())
      .pipe(uglify()),
    // NOTE use this statement to bundle a JavaScript library that cannot be browserified, like jQuery
    //vfs.src(require.resolve('<package-name-or-require-path>'), opts).pipe(concat('js/vendor/<library-name>.js')),
    vfs.src(['js/vendor/*.min.js'], { ...opts }),
    vfs.src('stylesheets/vendor/*.css', { ...opts }),
    vfs.src(`${dest}/font/*.{ttf,woff*(2)}`, opts),
    vfs.src('img/**/*.{gif,ico,jpg,png,svg}', opts).pipe(
      preview
        ? through()
        : imagemin(
          [
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo({
              plugins: [
                { cleanupIDs: { preservePrefixes: ['icon-', 'view-'] } },
                { removeViewBox: false },
                { removeDesc: false },
              ],
            }),
          ].reduce((accum, it) => (it ? accum.concat(it) : accum), [])
        )
    ),
    vfs.src('helpers/*.js', opts),
    vfs.src('layouts/*.hbs', opts),
    vfs.src('partials/*.hbs', opts)
  ).pipe(vfs.dest(dest, { sourcemaps: sourcemaps && '.' }))

  // TODO: perform merge op and font processing sequentially
  return  libFonts()

}
