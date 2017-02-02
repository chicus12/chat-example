'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')

gulp.task('sass', () => {
  return gulp.src('./src/public/main.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/public/css'))
})

gulp.task('sass:watch', () => {
  gulp.watch('./src/public/main.sass', ['sass'])
})
