'use strict'

const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat')
const fs = require('fs-extra')
const imagemin = require('gulp-imagemin')
const { obj: map } = require('through2')
const merge = require('merge-stream')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const vfs = require('vinyl-fs')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const ospath = require('path')
const path = ospath.posix
const postcssUrl = require('postcss-url')

module.exports = (src, dest, preview) => () => {
  const opts = { base: src, cwd: src }
  const sourcemaps = preview || process.env.SOURCEMAPS === 'true'
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
    })]

  function scss () {
    return vfs
      .src('stylesheets/site.scss', { ...opts, sourcemaps })
      .pipe(postcss(postcssPlugins))
      .pipe(sass(sass({
        includePaths: ['./node_modules'],
      })))
  }

  return merge(
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
      .src(['js/vendor/*.js', '!js/vendor/*.min.js'], { ...opts, read: false })
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
    vfs
      .src(['js/vendor/*.min.js'], { ...opts }),
    vfs
      .src('stylesheets/vendor/*.css', { ...opts }),
    vfs.src('font/*.{ttf,woff*(2)}', opts),
    vfs
      .src('img/**/*.{gif,ico,jpg,png,svg}', opts)
      .pipe(
        imagemin(
          [
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
          ].reduce((accum, it) => (it ? accum.concat(it) : accum), [])
        )
      ),
    vfs.src('helpers/*.js', opts),
    vfs.src('layouts/*.hbs', opts),
    vfs.src('partials/*.hbs', opts)
  ).pipe(vfs.dest(dest, { sourcemaps: sourcemaps && '.' }))
}
