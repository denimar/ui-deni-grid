var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');

module.exports = function() {

  gulp.src([
    './src/index.scss'
  ])
  .pipe(sass().on("error", function(error) {
    var pos = error.file.lastIndexOf('/');
    var file = error.file.substr(pos + 1);
    var message = error.messageFormatted;

    notify({
      title: file,
      message: 'line ' + error.line + ', column ' + error.column + ': ' + error.messageOriginal,
      sound: 'Frog',
    }).write({});
  }))

  .pipe(rename('index.css'))
  .pipe(gulp.dest(process.env.DIST_FOLDER))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(rename('index.min.css'))
  .pipe(gulp.dest(process.env.DIST_FOLDER))
  .pipe((notify({
    title: 'Sass successfully!',
    message: 'file: <%= file.relative %>'
  })))
  .pipe(livereload());

}
