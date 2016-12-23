// conf.js
exports.config = {
  sauceUser: 'denimarmoraes',
  sauceKey: 'd6a4e55a-a8e1-4aee-bc17-0d4d690f07b5',

  //seleniumAddress: 'http://ondemand.saucelabs.com:80/wd/hub',
  specs: ['test/*spec.js'],

  // restartBrowserBetweenTests: true,

  onPrepare: function(){
      var caps = browser.getCapabilities()
  },

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

    var printSessionId = function(jobName){
      browser.getSession().then(function(session) {
        console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
      });
    }
    printSessionId("ui-deni-grid");
  }
}
