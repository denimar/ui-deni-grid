var gulp = require('gulp');
var livereload = require('gulp-livereload');

module.exports = function() {

	gulp.watch(['src/**/*.scss'], ['sass']);
  	gulp.watch(['src/*.js'], ['scripts']);  

  	// Create LiveReload server
	livereload.listen({ 
		basePath: process.env.DIST_FOLDER + '/'
		//basePath: './'
	});

}