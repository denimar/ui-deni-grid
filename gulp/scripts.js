var gulp = require('gulp');
var babel = require("gulp-babel");
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var gulpUtil = require('gulp-util');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');

process.env.DISABLE_NOTIFIER = true;

gulp.task('scripts', function() {

  gulp.src('./src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.module.js')

  //////////////////////////////////////////////////////////////////////
  // Files which are part of the project
  // note: It was used "gulp-add-src" to put the files in order
  //////////////////////////////////////////////////////////////////////

  //dropdown item component
  //.pipe(addsrc.append('./src/components/ui-deni-grid-dropdown/ui-deni-grid-dropdown-item.module.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.service.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.controller.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.directive.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.run.js'))

  //dropdown component
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown/ui-deni-grid-dropdown.module.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown/ui-deni-grid-dropdown.service.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown/ui-deni-grid-dropdown.controller.js'))
  .pipe(addsrc.append('./src/components/ui-deni-grid-dropdown/ui-deni-grid-dropdown.run.js'))

  //ui-deni-grid itself
  .pipe(addsrc.append('./src/ui-deni-grid.module.js'))
  .pipe(addsrc.append('./src/ui-deni-grid.constant.js'))
  .pipe(addsrc.append('./src/ui-deni-grid.directive.js'))
  .pipe(addsrc.append('./src/ui-deni-grid-helper.service.js')) //Kind of Privates Methods, Variables, Constants...)
  .pipe(addsrc.append('./src/ui-deni-grid-events.service.js')) //All internal events are there
  .pipe(addsrc.append('./src/ui-deni-grid.controller.js'))
  .pipe(addsrc.append('./src/ui-deni-grid.service.js'))
  .pipe(addsrc.append('./src/ui-deni-grid-api.service.js')) //Interface for the final user
  .pipe(addsrc.append('./src/ui-deni-grid.run.js'))
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  //
  .pipe(jshint('.jshintrc'))

  // Concatenate all files into a one
  //.pipe(concat('ui-deni-grid.js'))

  //
  .pipe(notify(function(file) {
    if (file.jshint.success) {
      // Don't show something if success
      return false;
    }

    var errors = file.jshint.results.map(function(data) {
      if (data.error) {
        return '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
      }
    }).join('\n');


    var pos = file.relative.lastIndexOf('\\');
    var fileName = file.relative.substr(pos + 1);

    return {
      title: fileName,
      message: errors,
      sound: 'Frog'
    }
  }))

  .pipe(babel())

  // Concatenate all files into a one
  .pipe(concat(process.env.DIST_FOLDER + '/ui-deni-grid.js'))

  // Throw above file into a dist folder
  .pipe(gulp.dest('./'))

  // Compress that file
  .pipe(rename(process.env.DIST_FOLDER + '/ui-deni-grid.min.js'))

  // If eventually happened some error...
  .pipe(uglify().on("error", notify.onError(function(error) {
    var pos = error.message.indexOf('js:');
    var message = error.message.substr(pos + 4);

    return {
      message: message + ', line: ' + error.lineNumber,
      title: 'Scripts (Error)',
      sound: 'Frog'
    }

  }))) // notice the error event here

  // Throw the compressed file into a dist folder
  .pipe(gulp.dest('./'))
  .pipe((notify({
    title: 'Scripts successfully!',
    message: 'file: <%= file.relative %>',
    sound: null
  })))
  .pipe(livereload(process.env.RELOAD_PORT));

});
