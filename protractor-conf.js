var config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //sauceSeleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/**/*.spec.js'],
  // sauceUser: 'denimar',
  // sauceKey: '6bda91d2-ca2c-4ea0-bf43-4c2a891118f9',
  // // Capabilities to be passed to the webdriver instance.
  // // This option is called "capabilities" in the protractor docs
  // // but whatever.  this also works.
  // multiCapabilities: [{
  //     // by default, these first two browsers will come up in
  //     // Linux if you don't specify an OS
  //     'name': 'Chrome',
  //     'browserName': 'chrome'
  // }, {
  //     'name': 'Firefox',
  //     'browserName': 'firefox'
  // }, {
  //     'name': 'Win XP/IE8',
  //     'os': 'Windows XP',
  //     'browserName': 'internet explorer',
  //     'version': '8.0'
  // }, {
  //     'name': 'Win7/IE8',
  //     'os': 'Windows 7',
  //     'browserName': 'internet explorer',
  //     'version': '8.0'
  // }, {
  //     'name': 'Win7/IE9',
  //     'os': 'Windows 7',
  //     'browserName': 'internet explorer',
  //     'version': '9.0'
  // }, {
  //     'name': 'Win8/IE10',
  //     'os': 'Windows 8',
  //     'browserName': 'internet explorer',
  //     'version': '10.0'
  // }, {
  //     'name': 'Win8.1/IE11',
  //     'os': 'Windows 8.1',
  //     'browserName': 'internet explorer',
  //     'version': '11.0'
  // }],
  //
  // // Options to be passed to Jasmine-node.
  // jasmineNodeOpts: {
  //     showColors: true,
  //     defaultTimeoutInterval: 30000
  // },

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
  // restartBrowserBetweenTests: true,

  /*
  onPrepare: function(){
      var caps = browser.getCapabilities()
  },

  multiCapabilities: [
    // {
    //   browserName: 'firefox',
    //   version: '32',
    //   platform: 'OS X 10.10',
    //   name: "firefox-tests",
    //   shardTestFiles: true,
    //   maxInstances: 25
    // },
    {
      browserName: 'chrome',
      version: '41',
      platform: 'Windows 7',
      name: "chrome-tests",
      shardTestFiles: true,
      maxInstances: 25
    }
  ],

  onComplete: function() {

    var printSessionId = function(jobName){
      browser.getSession().then(function(session) {
        console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
      });
    }
    printSessionId("Insert Job Name Here");
  }
  */

};

exports.config = config;
