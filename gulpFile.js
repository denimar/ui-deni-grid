process.env.DIST_FOLDER = './dist';
process.env.RELOAD_PORT = 35730;

//third-party modules
var gulp = require('gulp');
var coveralls = require('gulp-coveralls');
// Mocha, our test framework
var mocha = require('gulp-mocha');

// Istanbul, our code coverage tool
var istanbul = require('gulp-instanbul');

//own modules
var sass = require('./gulp/sass');
//var html = require('./gulp/html');
var scripts = require('./gulp/scripts');
var dist = require('./gulp/dist');
var serve = require('./gulp/serve');
var watch = require('./gulp/watch');

//Taks which are part of the "dist" task
gulp.task('sass', sass);
//gulp.task('html', html);
gulp.task('scripts', scripts);
gulp.task('dist', dist);

//Serve the application
gulp.task('serve', serve);

//Watch for changes in: sass, html, scripts and images
gulp.task('watch', watch);

gulp.task('coveralls', ['test'], function() {
    // If not running on a CI environment it won't send lcov.info to coveralls
    if (!process.env.CI) {
        return;
    }

    return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
      .pipe(coveralls());
});


// gulp.task('sauce-start', function(cb) {
//   tunnel = new SauceTunnel('denimar', '6bda91d2-ca2c-4ea0-bf43-4c2a891118f9', 'testing ui-deni-grid', true);
//
//   var methods = ['write', 'writeln', 'error', 'ok', 'debug'];
//   methods.forEach(function(method) {
//     tunnel.on('log: ' + method, function(text) {
//       console.log(method + ': ' + text);
//     });
//     tunnel.on('verbose: ' + method, function(text) {
//       console.log(method + ': ' + text);
//     });
//   });
//   // <<<< End enhance logging
//
//   tunnel.start(function(isCreated) {
//     if (!isCreated) {
//       cb('Failed to create Sauce tunnel.');
//     }
//     console.log('Connected to Sauce Labs.');
//     cb();
//   });
// });
//
// gulp.task('sauce-end', function(cb) {
//   tunnel.stop(function() {
//     cb();
//   });
// });
//
// gulp.task('sauce-test', ['sauce-start'], function() {
//       gulp.src('./test/**/*.spec.js')
//         .pipe({
//             configFile: 'protractor-conf.js'
//           }.on('error', function(e) {
//             throw e;
//           }).on('end', function() {
//             console.log('Stopping the server.');
//             gulp.run('sauce-end');
//           }));
//         });
//
//     // Default Task
//     gulp.task('default', ['dist', 'serve', 'watch']);
