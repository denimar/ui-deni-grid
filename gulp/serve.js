var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('serve', function() {

	gulp.src([
			'./dist/',
			'./'
		])

		.pipe(webserver({
			directoryListing: true,
			open: true,
			port: 3001,
			//open: 'http://localhost:3001/examples/api-usage/index.html'
			open: 'http://localhost:3001/examples/basic/action-columns/index.html'
		}));

});
