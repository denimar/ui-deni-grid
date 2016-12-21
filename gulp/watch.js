var gulp = require('gulp');
var livereload = require('gulp-livereload');
var sass = require('./sass.js');
var html = require('./html.js');

module.exports = function() {

	gulp.watch('./src/index.scss', function() {
		sass();
	});

  gulp.watch('./src/index.html', function() {
		html();
	});

	// Create LiveReload server
	livereload.listen({
		basePath: process.env.DIST_FOLDER
	});

}
