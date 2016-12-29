var capabilities = require('capabilities');

exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

  specs: ['specs/*.spec.js'],
  //specs: ['test/usability/*.spec.js'],

  onPrepare: () => {
    browser.driver.manage().window().maximize();
  },

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
  multiCapabilities: capabilities.getMultiCapabilities()

}
