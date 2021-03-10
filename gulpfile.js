/* eslint-disable node/no-unpublished-require */
const gulp = require('gulp');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');
const webpackStream = require('webpack-stream');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

const SASS_SOURCE = ['./source/sass/*.sass', './source/sass/**/*.sass'];

const TS_SOURCE = ['./source/js/*.ts', './source/js/*/**.ts'];

gulp.task('sass', () => {
  return gulp
    .src('./source/sass/main.sass')
    .pipe(
      sass({
        outputStyle: 'compressed',
        includePaths: ['./node_modules/'],
      })
    )
    .on('error', sass.logError)
    .pipe(
      rename(path => {
        path.basename += '.min';
      })
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('ts:dev', () => {
  return gulp
    .src('./source/js/main.ts')
    .pipe(webpackStream(webpackDevConfig, webpack))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('ts:prod', () => {
  return gulp
    .src('./source/js/main.ts')
    .pipe(webpackStream(webpackProdConfig, webpack))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', () => {
  gulp.watch(SASS_SOURCE, {ignoreInitial: false}, gulp.series('sass'));
  gulp.watch(TS_SOURCE, {ignoreInitial: false}, gulp.series('ts:dev'));
});

gulp.task('build', gulp.parallel('sass', 'ts:prod'));
gulp.task('default', gulp.series('watch'));
