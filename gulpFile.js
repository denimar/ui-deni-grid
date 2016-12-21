//third-party modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var webserver = require('gulp-webserver');

//own modules
var sass = require('./gulp/sass.js');
var html = require('./gulp/html.js');
var dist = require('./gulp/dist.js');
var serve = require('./gulp/serve.js');
var watch = require('./gulp/watch.js');

//
process.env.DIST_FOLDER = './';

//tasks
gulp.task('sass', sass);
gulp.task('html', html);
gulp.task('dist', html);
gulp.task('serve', serve);
gulp.task('watch', watch);

//default Task
gulp.task('default', ['dist', 'serve', 'watch']);
