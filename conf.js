// conf.js
exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

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

  onComplete: function(par1, par2, par3) {

    console.log('-----------------------');
    console.log('par1 : ' + par1);
    console.log('par2 : ' + par2);
    console.log('par3 : ' + par3);
    console.log('-----------------------');

    var printSessionId = function(jobName){
      browser.getSession().then(function(session, par4, par5, par6) {
        console.log('-----------------------');
        console.log('par4 : ' + par4);
        console.log('par5 : ' + par5);
        console.log('par6 : ' + par6);
        console.log('-----------------------');

        var caps = session.caps_.caps_;
        var webdriverId = caps.webdriver.remote.sessionid;
        var platform = caps.platform;
        var browserName = caps.browserName;
        var browserVersion = caps.version;

        console.log('-----------------------');
        console.log('SauceOnDemandSessionID : ' + session.getId());
        console.log('WebDriver Id : ' + webdriverId);
        console.log('Platform : ' + platform);
        console.log('Browser name : ' + browserName);
        console.log('Browser version : ' + browserVersion);
        console.log('-----------------------');
      });
    }
    printSessionId("ui-deni-grid");
  }
}
