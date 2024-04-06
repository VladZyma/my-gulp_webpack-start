const { src, dest, watch, parallel, series } = require('gulp');

// APP FOLDERS
const srcFolder = 'src';
// const srcFolder = 'app';
const distFolder = 'dist';
// const distFolder = 'docs';

// FILES
const changed = require('gulp-changed');
const concat = require('gulp-concat');

// SERVER
const server = require('gulp-server-livereload');

// HTML
const includeHTML = require('gulp-file-include');
const cleanHTML = require('gulp-htmlclean');
const typograf = require('gulp-typograf');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const groupMedia = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');

// JS
// const uglify = require('gulp-uglify-es').default;
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

// IMAGES
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');

// SVG SPRITE
const svgsprite = require('gulp-svg-sprite');

// FONTS
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

function startServer() {
  return src(`./${distFolder}`).pipe(server({ livereload: true, open: true }));
}

function html() {
  return src([`./${srcFolder}/**/*.html`, `!./${srcFolder}/components/*.html`])
    .pipe(changed(`./${distFolder}`, { hasChanged: changed.compareContents }))
    .pipe(
      includeHTML({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(
      typograf({
        locale: ['ru', 'en-US'],
        htmlEntity: { type: 'digit' },
        safeTags: [
          ['<\\?php', '\\?>'],
          ['<no-typography>', '</no-typography>'],
        ],
      })
    )
    .pipe(cleanHTML())
    .pipe(dest(`./${distFolder}`));
}

function styles() {
  return src([`./${srcFolder}/scss/*.scss`])
    .pipe(changed(`./${distFolder}/css`))
    .pipe(sassGlob())
    .pipe(groupMedia())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(concat('styles.min.css'))
    .pipe(dest(`./${distFolder}/css`));
}

function scripts() {
  return (
    src(`./${srcFolder}/js/*.js`)
      .pipe(changed(`./${distFolder}/js`))
      // .pipe(uglify())
      // .pipe(concat('script.min.js'))
      .pipe(babel())
      .pipe(webpack(require('./webpack.config')))
      .pipe(dest(`./${distFolder}/js`))
  );
}

function img() {
  return src([
    `./${srcFolder}/images/**/*.*`,
    `!./${srcFolder}/images/**/*.svg`,
  ])
    .pipe(changed(`./${distFolder}/images`))
    .pipe(avif({ quality: 50 }))

    .pipe(
      src([`./${srcFolder}/images/**/*.*`, `!./${srcFolder}/images/**/*.svg`])
    )
    .pipe(changed(`./${distFolder}/images`))
    .pipe(webp())

    .pipe(
      src([`./${srcFolder}/images/**/*.*`, `!./${srcFolder}/images/**/*.svg`])
    )
    .pipe(changed(`./${distFolder}/images`))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(`./${distFolder}/images`));
}

function svg() {
  return src(`./${srcFolder}/images/**/*.svg`)
    .pipe(changed(`./${distFolder}/images/**/*.svg`))
    .pipe(
      svgsprite({
        mode: {
          symbol: {
            sprite: '../sprite.symbol.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                js2svg: { indent: 4, pretty: true },
              },
            },
          ],
        },
      })
    )
    .pipe(dest(`./${distFolder}/images/svgsprite`));
}

function fonts() {
  return src(`./${srcFolder}/fonts/*.*`)
    .pipe(changed(`./${distFolder}/fonts/*.*`))
    .pipe(fonter({ formats: ['woff', 'ttf'] }))
    .pipe(src(`./${srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(dest(`./${distFolder}/fonts`));
}

function watching() {
  watch([`./${srcFolder}/**/*.html`], html);
  watch([`./${srcFolder}/scss/**/*scss`], styles);
  watch([`./${srcFolder}/js/**/*.js`], scripts);
  watch(
    [`./${srcFolder}/images/**/*.*`, `!./${srcFolder}/images/**/*.svg`],
    img
  );
  watch([`./${srcFolder}/images/**/*.svg`], svg);
  watch([`./${srcFolder}/fonts/*.*`], fonts);
}

exports.startServer = startServer;
exports.watching = watching;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.svg = svg;
exports.fonts = fonts;

exports.default = series(
  parallel(html, styles, scripts, img, svg, fonts),
  startServer,
  watching
);
