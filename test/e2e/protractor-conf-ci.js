var capabilities = require('./capabilities');

exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

  specs: ['specs/*.spec.js'],
  //specs: ['test/usability/*.spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    //defaultTimeoutInterval: 360000
    isVerbose: true,
    print: true
  },

  maxInstances: 1,
  maxSessions: 5,

  onPrepare: () => {
    browser.driver.manage().window().maximize();

    return browser.getProcessedConfig().then(function(config) {
      console.log('########################################################################');
      console.log('E2E TESTS (Protractor+Jasmine) #########################################');
      console.log('TRAVIS : ' + process.env.TRAVIS);
      console.log('########################################################################');
    });
  },

  //restartBrowserBetweenTests: true,
  //allScriptsTimeout: 20000,

  /*
  *************************************************************************************
  *  Before set whatever browser here see:
  *  http://www.protractortest.org/#/browser-support and https://saucelabs.com/platforms
  *************************************************************************************
  */
  multiCapabilities: capabilities.getMultiCapabilities()

}
