var capabilities = require('./capabilities');

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
  maxSessions: 5,

  onPrepare: () => {
    browser.driver.manage().window().maximize();

    return browser.getProcessedConfig().then(function(config) {
      if (process.env.TRAVIS) {
        config.sauceUser: 'ui-deni-grid',
        config.sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

        /*
        *************************************************************************************
        *  Before set whatever browser here see:
        *  http://www.protractortest.org/#/browser-support and https://saucelabs.com/platforms
        *************************************************************************************
        */
        config.multiCapabilities: capabilities.getMultiCapabilities()
      }
    });
  },

  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    print: true
    //defaultTimeoutInterval: 9990000
  },

  //shardTestFiles: true,
  //maxInstances: 5,
  //restartBrowserBetweenTests: true

};
