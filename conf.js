// conf.js
exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

  //seleniumAddress: 'http://ondemand.saucelabs.com:80/wd/hub',
  specs: ['test/*spec.js'],

  multiCapabilities: [{
    browserName: 'firefox',
    version: '32',
    platform: 'OS X 10.10',
    name: "firefox-tests",
    shardTestFiles: true,
    maxInstances: 25
  }, {
    browserName: 'chrome',
    version: '41',
    platform: 'Windows 7',
    name: "chrome-tests",
    shardTestFiles: true,
    maxInstances: 25
  }],

  onComplete: function() {

    browser.getSession().then(function(session) {


      console.log('SauceOnDemandSessionID=' + session.getId());
      console.log('-----------------------');
      console.log(session.caps_.caps_.webdriver.remote.sessionid);
      console.log('-----------------------');
    });
  }
}
