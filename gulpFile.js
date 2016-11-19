//third-party modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var webserver = require('gulp-webserver');

var DIST_FOLDER = './';

gulp.task('sass', function() {
	gulp.src(['./src/index.scss'])
		.pipe(sass().on("error", function(error) {
			var pos = error.file.lastIndexOf('/');
			var file = error.file.substr(pos + 1);
			var message = error.formattedMessage;

			notify({
				title: file,
				message: 'line ' + error.line + ', column ' + error.column + ': ' + error.originalMessage,
		        sound: 'Frog',
				icon: path.join(__dirname, 'images/gulp/error.png')
			}).write({});
		}))
		
	    .pipe(rename('index.min.css'))
	    .pipe(cleanCSS({compatibility: 'ie8'}))
	    .pipe(gulp.dest(DIST_FOLDER))
		.pipe((notify({
	        title: 'Sass successfully!',
	        message: 'file: <%= file.relative %>',
			icon: path.join(__dirname, 'images/gulp/successfully.png')
		})))
	    .pipe(livereload());	
})

gulp.task('html', function() {
	gulp.src('./src/index.html')
		.pipe(gulp.dest(DIST_FOLDER))
		.pipe((notify({
	        title: 'HTMLs successfully!',
	       	icon: path.join(__dirname, 'images/gulp/successfully.png'),
	       	message: 'HTMLs copied!',
	       	onLast: true
		})))
		.pipe(livereload());
});

gulp.task('scripts', function() {
});

gulp.task('dist', function() {
	gulp.start('sass', 'html', 'scripts');
});

gulp.task('serve', function() {
	gulp.src(['./', DIST_FOLDER])
		.pipe(webserver({
			//livereload: true,
			//directoryListing: true,
			//fallback: 'index.html',
			open: true,
			port: 3000,
			//open: 'http://localhost:3000/ui-deni-grid'
	    }));
});

gulp.task('watch', function() {
	gulp.watch(['./src/index.scss'], ['sass']);
  	gulp.watch(['./src/index.html'], ['html']);   		
  	//gulp.watch(['./src/*.js'], ['scripts']);  

  	// Create LiveReload server
	livereload.listen({ 
		basePath: DIST_FOLDER + '/'
		//basePath: './'
	});
});


// Default Task
gulp.task('default', ['dist', 'serve', 'watch']);