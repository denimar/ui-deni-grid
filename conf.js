// conf.js
exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',
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

        console.log('SauceOnDemandSessionID : ' + session.getId());
        console.log('webDriver : ' + session.caps_.caps_.webdriver);        

        /*
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
        */
      });

  }
}
