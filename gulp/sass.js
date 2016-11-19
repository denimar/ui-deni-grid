var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');

function compileSass(sassFile, targetFileName) {
    gulp.src([sassFile])
    	.pipe(sass().on("error", function(error) {
			var pos = error.file.lastIndexOf('/');
			var file = error.file.substr(pos + 1);
			var message = error.formattedMessage;

			notify({
				title: file,
				message: 'line ' + error.line + ', column ' + error.column + ': ' + error.originalMessage,
		        sound: 'Frog',
				icon: path.join(__dirname, 'error.png')
			}).write({});
		}))
		
        .pipe(gulp.dest(process.env.DIST_FOLDER))        
        .pipe(rename(targetFileName))
        .pipe(gulp.dest(process.env.DIST_FOLDER))
		.pipe((notify({
	        title: 'Sass successfully!',
	        message: 'file: <%= file.relative %>',
			icon: path.join(__dirname, 'successfully.png')
		})))
        .pipe(livereload());	
}

module.exports = function() {
	compileSass('./src/ui-deni-grid.scss', 'ui-deni-grid.min.css');
}