var gulp = require('gulp');
var webserver = require('gulp-webserver');

module.exports = function() {

	gulp.src([
			'./dist/',
			'./'
		])

		.pipe(webserver({
			//livereload: true,
			directoryListing: true,
			//fallback: 'index.html',
			//fallback: './examples/searches-and-filters/column-filter/basic-config/index.html',
			//fallback: './examples/searches-and-filters/local-column-filter/index.html',
			open: true,
			port: 3001,
			//open: 'http://localhost:3001/examples/api-usage/index.html'
			open: 'http://localhost:3001/examples/usability/api-usage/index.html'
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
