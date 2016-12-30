var capabilities = require('./capabilities');

exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

  specs: ['specs/*.spec.js'],
  //specs: ['test/usability/*.spec.js'],

  // onPrepare: () => {
  //   browser.driver.manage().window().maximize();
  // },

  jasmineNodeOpts: {
    showColors: true,
    //defaultTimeoutInterval: 360000
    isVerbose: true
  },

  maxInstances: 1,
  maxSessions: 5,
  //restartBrowserBetweenTests: true,
  //allScriptsTimeout: 20000,

  /*
  *************************************************************************************
  *  Before set whatever browser here see:
  *  http://www.protractortest.org/#/browser-support and https://saucelabs.com/platforms
  *************************************************************************************
  */
  multiCapabilities: capabilities.getMultiCapabilities(),

  framework: 'jasmine2',
onPrepare: function() {
    browser.driver.manage().window().maximize();
    var jasmineReporters = require('jasmine-reporters');

    // returning the promise makes protractor wait for the reporter config before executing tests
    return browser.getProcessedConfig().then(function(config) {
        // you could use other properties here if you want, such as platform and version
        //var browserName = config.capabilities.browserName;

        var junitReporter = new jasmineReporters.TerminalReporter({
            consolidateAll: true,
            //savePath: 'testresults',
            // this will produce distinct xml files for each capability
            //filePrefix: browserName + '-xmloutput',
            /*
            modifySuiteName: function(generatedSuiteName, suite) {
                // this will produce distinct suite names for each capability,
                // e.g. 'firefox.login tests' and 'chrome.login tests'
                return browserName + '.' + generatedSuiteName;
            }
            */
        });
        jasmine.getEnv().addReporter(junitReporter);
    });
},

}
