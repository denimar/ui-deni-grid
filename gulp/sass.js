var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');

function compileSass(sassFile, targetFileName) {

    gulp.src([
    		'./src/ui-deni-grid.scss',
    		'./src/components/ui-deni-grid-dropdown/ui-deni-grid-dropdown.scss',
    		'./src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.scss',
    		'./src/components/ui-deni-grid-dropdown-item/templates/filters/*.scss'
    	])
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

        .pipe(concat('ui-deni-grid.scss'))
        .pipe(rename('ui-deni-grid.css'))
        .pipe(gulp.dest(process.env.DIST_FOLDER))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename('ui-deni-grid.min.css'))
        .pipe(gulp.dest(process.env.DIST_FOLDER))
		.pipe((notify({
	        title: 'Sass successfully!',
	        message: 'file: <%= file.relative %>',
			icon: path.join(__dirname, 'successfully.png')
		})))
        .pipe(livereload(process.env.RELOAD_PORT));	
}

module.exports = function() {
	compileSass('','ui-deni-grid.min.css');
}
