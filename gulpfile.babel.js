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

let paths = {
  styles: {
    src: 'src/sity/css/**/*.scss',
    dest: 'build/css/'
  },
  scripts: {
    src: 'src/sity/js/**/*.js',
    dest: 'build/js/'
  },
  lib: {
    src: 'lib/**',
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


function clean(callback) {
  del([ 'build' ]);
  callback();
  return null;
}


function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
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
      .pipe(gulp.dest(paths.html.dest));
  }

function watch() {
  gulp.watch(paths.scripts.src, scripts);
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
    clean(function() {
        styles(); 
        scripts(); 
        lib();
        image();
        data();
        html();
    });
};

gulp.task('build', build);

gulp.task('default', build);

gulp.task('watch', watch);
