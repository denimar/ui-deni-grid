var capabilities = require('./capabilities');

config = {
  specs: ['specs/*.spec.js'],

  files: [
  ],

  // seleniumArgs: ['-Dwebdriver.ie.driver=C:\Denimar\IEDriverServer.exe'],
  // capabilities: {
  //   'browserName': 'internet explorer',
  //   'platform': 'Windows 10',
  //   'version': '11'
  // },

  maxInstances: 1,
  maxSessions: 5,

  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true
  },

  onPrepare: function () {
    browser.driver.manage().window().maximize();

    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: 'all',      // display stacktrace for each failed assertion, values: (all|specs|summary|none)
        displaySuccessesSummary: true, // display summary of all successes after execution
        displayFailuresSummary: true,   // display summary of all failures after execution
        displayPendingSummary: true,    // display summary of all pending specs after execution
        displaySuccessfulSpec: true,    // display each successful spec
        displayFailedSpec: true,        // display each failed spec
        displayPendingSpec: true,      // display each pending spec
        displaySpecDuration: true,     // display each spec duration
        displaySuiteNumber: true,      // display each suite number (hierarchical)
        colors: {
            success: 'green',
            failure: 'red',
            pending: 'yellow'
        },
        prefixes: {
            success: '✓ ',
            failure: '✗ ',
            pending: '* '
        },
        customProcessors: []
      }
    }));
  }
  //shardTestFiles: true,
  //maxInstances: 5,
  //restartBrowserBetweenTests: true

};

if (process.env.TRAVIS) {
  console.log('########################################################################');
  console.log('E2E TESTS (Protractor+Jasmine) #########################################');
  console.log('########################################################################');

  config.sauceUser = 'ui-deni-grid';
  config.sauceKey = '6b220e08-e488-43c0-982d-b76e0e4b9170';

  /*
  *************************************************************************************
  *  Before set whatever browser here see:
  *  http://www.protractortest.org/#/browser-support and https://saucelabs.com/platforms
  *************************************************************************************
  */
  config.multiCapabilities = capabilities.getMultiCapabilities();

} else {
  config.seleniumAddress = 'http://localhost:4444/wd/hub';
}

exports.config = config;
