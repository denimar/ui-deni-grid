var gulp = require('gulp');
var livereload = require('gulp-livereload');

module.exports = function() {

	gulp.watch(['./src/ui-deni-grid.scss', './src/components/**/*.scss', './src/components/ui-deni-grid-dropdown-item/templates/filters/*.scss'], ['sass']);
  	gulp.watch(['./src/*.js', './src/components/**/*.js'], ['scripts']);  

  	// Create LiveReload server
	livereload.listen({ 
		basePath: process.env.DIST_FOLDER + '/'
		//basePath: './'
	});

}