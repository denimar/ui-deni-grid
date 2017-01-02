process.env.DIST_FOLDER = './dist';
process.env.RELOAD_PORT = 35730;

//third-party modules
var gulp = require('gulp');

var dist = require('./gulp/dist');
var serve = require('./gulp/serve');
var watch = require('./gulp/watch');

// Default Task
gulp.task('default', ['dist', 'serve', 'watch']);
