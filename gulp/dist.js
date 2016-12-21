var gulp = require('gulp');

//own modules
var sass = require('./sass.js')
var html = require('./html.js');

module.exports = function() {

	sass();
  html();

}
