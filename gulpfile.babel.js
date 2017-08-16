const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
//const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const template = require('gulp-template');
const dataR = require('gulp-data');
const regeneratorRuntime =  require("regenerator-runtime");
const include = require('gulp-include');

let paths = {
  styles: {
    src: 'src/sity/css/**/*.scss',
    dest: 'build/css/'
  },
  scripts: {
    src: 'src/sity/js/_include.js',
    dest: 'build/js/'
  },
  scripts_watch: {
      src: 'src/sity/js/**/*.js',
      dest: 'build/js/'
    },
  lib: {
    src: [
        'lib/**', 
        'node_modules/vue/dist/vue.min.js',
        'node_modules/vue-resource/dist/vue-resource.min.js',
        ],
    dest: 'build/lib/'
  },
  image: {
    src: 'src/sity/image/**',
    dest: 'build/image/'
  },
  data: {
    src: 'public/@(json|upload)/**',
    dest: 'build/data/'
  },
  html: {
    src: 'src/sity/index.html',
    dest: 'build/'
  }
};


function clean() {
  del([ 'build' ]);
}


function styles() {
  html();
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    // pass in options to the stream
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  html();
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(include())
        .on('error', console.log)
    .pipe(babel())
    //.pipe(uglify())
    .pipe(concat('custom.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function lib() {
    return gulp.src(paths.lib.src)
      .pipe(gulp.dest(paths.lib.dest));
  }

function image() {
    return gulp.src(paths.image.src)
      .pipe(gulp.dest(paths.image.dest));
  }

function data() {
    return gulp.src(paths.data.src)
      .pipe(gulp.dest(paths.data.dest));
  }

function html() {
    return gulp.src(paths.html.src)
      .pipe(dataR(() => ({autoversion: Date.now()})))
      .pipe(template())
      .pipe(gulp.dest(paths.html.dest));
  }

function watch() {
  build();
  gulp.watch(paths.scripts_watch.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.lib.src, lib);
  gulp.watch(paths.image.src, image);
  gulp.watch(paths.data.src, data);
  gulp.watch(paths.html.src, html);
}


exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.lib = lib;
exports.image = image;
exports.data = data;
exports.html = html;


var build = function() {
    //clean();
    styles(); 
    scripts(); 
    lib();
    image();
    data();
    html();
};

gulp.task('build', build);

gulp.task('default', build);

gulp.task('watch', watch);

gulp.task('clean', clean);

