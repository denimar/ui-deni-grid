var gulp = require('gulp');
var sass = require('./sass.js');
var scripts = require('./scripts.js');

gulp.task('dist', [
  'sass',
  'scripts'
]);
