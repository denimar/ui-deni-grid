var config = {
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

if (process.env.TRAVIS) {

  console.log('----------------------------');
  process.env.SAUCE_USERNAME
  console.log('----------------------------');
  console.log('----------------------------');
  process.env.SAUCE_ACCESS_KEY
  console.log('----------------------------');
  console.log('----------------------------');
  process.env.TRAVIS_JOB_NUMBER
  console.log('----------------------------');
  process.env.TRAVIS_BUILD_NUMBER
  console.log('----------------------------');

  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities = {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER
  };
}

exports.config = config;
