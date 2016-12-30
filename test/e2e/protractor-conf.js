exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs/array*.spec.js'],

  files: [
    './bower_components/jquery/dist/jquery.min.js'
  ],

  // seleniumArgs: ['-Dwebdriver.ie.driver=C:\Denimar\IEDriverServer.exe'],
  // capabilities: {
  //   'browserName': 'internet explorer',
  //   'platform': 'Windows 10',
  //   'version': '11'
  // },

  maxInstances: 1,
  maxSessions: 1,

  framework: 'jasmine2',
onPrepare: function() {
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
  // onPrepare: () => {
  //   browser.driver.manage().window().maximize();
  // },
  /*
  onPrepare: function() {
      browser.driver.manage().window().maximize();
      var jasmineReporters = require('jasmine-reporters');

      // returning the promise makes protractor wait for the reporter config before executing tests
      return browser.getProcessedConfig().then(function(config) {
          // you could use other properties here if you want, such as platform and version
          var browserName = config.capabilities.browserName;

          var junitReporter = new jasmineReporters.JUnitXmlReporter({
              consolidateAll: false,
              savePath: 'testresults',
              modifyReportFileName: function(generatedFileName, suite) {
                  // this will produce distinct file names for each capability,
                  // e.g. 'firefox.SuiteName' and 'chrome.SuiteName'
                  return browserName + '.' + generatedFileName;
              }
          });
          jasmine.getEnv().addReporter(junitReporter);
      });
  },
  */

  jasmineNodeOpts: {
    showColors: true,
    //defaultTimeoutInterval: 9990000
  },

  //shardTestFiles: true,
  //maxInstances: 5,
  //restartBrowserBetweenTests: true

};
