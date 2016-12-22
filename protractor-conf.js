exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/**/*.spec.js'],
  /*
  files: [
    './bower_components/angular/angular.js',
    './bower_components/angular-mocks/angular-mocks.js',
    //'./dist/ui-deni-treeview.js',
    //'./src/ui-deni-treeview-api/ui-deni-treeview-api.mock.js'
  ],
  */
  //allScriptsTimeout: 50000000,
  //rootElement: 'html',
  /*
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
  */
};
