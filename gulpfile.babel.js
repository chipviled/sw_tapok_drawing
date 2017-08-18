const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
//const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanR = require('gulp-clean');
const template = require('gulp-template');
const dataR = require('gulp-data');
//const regeneratorRuntime =  require("regenerator-runtime");
const include = require('gulp-include');
const gutil = require('gulp-util');
const inject = require('gulp-inject');

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
        'lib/**'
        ],
    src_prod: [
        'node_modules/vue/dist/vue.min.js',
        'node_modules/vue-resource/dist/vue-resource.min.js',
        ],
    src_dev: [
        'node_modules/vue/dist/vue.js',
        'node_modules/vue-resource/dist/vue-resource.js',
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

let env = gutil.env.env || 'dev';
let dev = (env === 'dev') ? true : false;
if (dev) gutil.log('--- DEVELOP mode ---') 
    else gutil.log('>>> PRODACTION mode <<<');


function clean() {  
    return gulp.src('build', {read: false})
        .pipe(cleanR());
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
    .pipe(!dev ? uglify() : gutil.noop())
    .pipe(concat('custom.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function lib() {
    return gulp.src(paths.lib.src)
      .pipe(gulp.dest(paths.lib.dest));
  }

function lib_from_modules() {
    return gulp.src(dev ? paths.lib.src_dev : paths.lib.src_prod)
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
      .pipe(inject(lib_from_modules(), {ignorePath: '/build/', addRootSlash:false}))
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

