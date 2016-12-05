var gulp = require('gulp');
var webserver = require('gulp-webserver');

module.exports = function() {

	gulp.src([
			'./', 
			//'./examples/searches-and-filters/column-filter/basic-config/',
			'./examples/searches-and-filters/filtering/', 
			'./src/components/ui-deni-grid-dropdown/',
			'./src/components/ui-deni-grid-dropdown-item/templates/filters/',
		])

		.pipe(webserver({
			//livereload: true,
			//directoryListing: true,
			//fallback: 'index.html',
			//fallback: './examples/searches-and-filters/column-filter/basic-config/index.html',
			fallback: './examples/searches-and-filters/filtering/index.html',
			open: true,
			port: 3000,
			//open: 'http://localhost:3000/ui-deni-grid'
	    }));

}


/*
var gulp = require('gulp');
var webserver = require('gulp-webserver');

module.exports = function() {

	//gulp.src(['./', 'process.env.DIST_FOLDER'])
	gulp.src(['.', process.env.DIST_FOLDER])
		.pipe(webserver({
			//livereload: true,
			//directoryListing: true,
			//fallback: 'examples/searches-and-filters/column-filter/basic-config/index.html',
			open: true,
			port: 3000,
			open: 'http://localhost:3000/examples/searches-and-filters/column-filter/basic-config/index.html'
	    }));

}
*/