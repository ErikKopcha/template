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
      cache        = require('gulp-cache');            // Подключаем библиотеку кеширования

gulp.task('clean', function(done) {
  return del.sync('build'),
  done();
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

gulp.task('scripts', function() {
  return gulp.src('source/js/main.js')
  .pipe(concat('main.js'))
  // .pipe(uglify())
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('image', function() {
  return gulp.src('source/img/**/*')
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}]
  }))
  .pipe(gulp.dest('build/img'));
});

gulp.task('copy', function() {
  return gulp.src([
    'source/fonts/**/*'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clear', function (callback) {
  return cache.clearAll();
});

gulp.task('browser-sync', function() {
  browserSync.init({        // Выполняем browserSync
      server: {             // Определяем параметры сервера
          baseDir: 'build'  // Директория для сервера - source
      },
      notify: false         // Отключаем уведомления
  });
});

gulp.task('watch', function() {
  gulp.watch('source/*.html', gulp.parallel('html'));
  gulp.watch('source/sass/**/*.scss', gulp.parallel('sass'));
  gulp.watch('source/js/**/*.js', gulp.parallel('scripts'));
});

gulp.task('start', gulp.parallel('clean', 'clear', 'image', 'html', 'sass', 'scripts', 'copy', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('clean', 'clear', 'image', 'html', 'sass', 'scripts', 'copy'));
