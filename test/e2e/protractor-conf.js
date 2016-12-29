exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs/*.spec.js'],

  files: [
    './bower_components/jquery/dist/jquery.min.js'
  ],

  /*
  seleniumArgs: ['-Dwebdriver.ie.driver=C:\Denimar\IEDriverServer.exe'],
  capabilities: {
    'browserName': 'internet explorer',
    'platform': 'Windows 10',
    'version': '11'
  },
  */

  maxInstances: 1,
  maxSessions: 1,

  onPrepare: () => {
    browser.driver.manage().window().maximize();
  },

  jasmineNodeOpts: {
    showColors: true,
    //defaultTimeoutInterval: 9990000
  },

  //shardTestFiles: true,
  //maxInstances: 5,
  //restartBrowserBetweenTests: true

};
