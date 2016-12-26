
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //specs: ['test/**/*.spec.js'],
  specs: ['test/basic/*.spec.js'],

  files: [
    './bower_components/jquery/dist/jquery.min.js'
  ],

  onPrepare: () => {
    browser.driver.manage().window().maximize();
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  //shardTestFiles: true,
  //maxInstances: 5,
  //restartBrowserBetweenTests: true

}
