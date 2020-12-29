'use strict';

const gulp         = require('gulp'),
      browserSync  = require('browser-sync').create(), // сервер для онлайн отслеживания изменений
      sass         = require('gulp-sass'),             // компилирует из sass в css
      autoprefixer = require('gulp-autoprefixer'),     // прописывает стили для кроссбраузерности
      plumber      = require('gulp-plumber'),          // выводит ошибки в консоль
      concat       = require('gulp-concat'),           // для сборки всех js в один файл с переименованием
      uglify       = require('gulp-uglify'),           // минификация js
      csso         = require('gulp-csso'),             // минификация css
      rename       = require('gulp-rename'),           // переименование файлов
      imagemin     = require('gulp-imagemin'),         // оптимизация картинок
      htmlmin      = require('gulp-htmlmin'),          // минификация html
      del          = require('del'),                   // удаление папок
      cache        = require('gulp-cache'),            // Подключаем библиотеку кеширования
      webpack = require("webpack-stream");             // webpack


gulp.task('clean', function(done) {
  return del.sync('build'),
  done();
});

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

gulp.task('html', function() {
  return gulp.src('source/*.html')
  .pipe(plumber())
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
  return gulp.src('source/sass/style.scss')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
  .pipe(csso())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('image', function() {
  return gulp.src('source/images/**/*')
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}]
  }))
  .pipe(gulp.dest('build/images'));
});

gulp.task('copy', function() {
  return gulp.src([
    'source/fonts/**/*',
    'source/icons/**/*'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
  browserSync.init({        // Выполняем browserSync
      server: {             // Определяем параметры сервера
          baseDir: 'build'  // Директория для сервера - source
      },
      notify: false         // Отключаем уведомления
  });
});

gulp.task("build-js", () => {
  return gulp.src("source/js/main.js")
  .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'js/script.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                      debug: true,
                      corejs: 3,
                      useBuiltIns: "usage"
                  }]]
                }
              }
            }
          ]
        }
  }))
  .pipe(gulp.dest('build'))
  .on("end", browserSync.reload);
});

gulp.task("build-js-prod", () => {
  return gulp.src("source/js/main.js")
    .pipe(webpack({
        mode: 'production',
        output: {
          filename: 'js/script.js'
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [['@babel/preset-env', {
                        corejs: 3,
                        useBuiltIns: "usage"
                    }]]
                  }
                }
              }
            ]
          }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('source/*.html', gulp.parallel('html'));
  gulp.watch('source/icons/**/*', gulp.parallel('copy'));
  gulp.watch('source/images/**/*', gulp.parallel('image'));
  gulp.watch('source/sass/**/*.scss', gulp.parallel('sass'));
  gulp.watch("source/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task('start', gulp.parallel('clean', 'clear', 'image', 'html', 'sass', 'build-js', 'copy', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('clean', 'clear', 'image', 'html', 'sass', 'build-js-prod', 'copy'));
