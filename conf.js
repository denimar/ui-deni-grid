// conf.js
exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

  //seleniumAddress: 'http://ondemand.saucelabs.com:80/wd/hub',

  specs: ['test/*spec.js'],

  onPrepare: function(){
    browser.getCapabilities().then(function(capability) {
      console.log('******************************');
      console.log(capability.caps_.platform);
      console.log(capability.caps_.browserName);
      console.log(capability.caps_.version);
      console.log('******************************');
      console.log(capability);
      console.log('******************************');
    });
  },

  multiCapabilities: [
    {
      // by default, these first two browsers will come up in
      // Linux if you don't specify an OS
      'name': 'Linux / Chrome',
      'browserName': 'chrome'
    },
    {
      'name': 'Firefox',
      'browserName': 'firefox'
    },
    // { DOESN'T WORK
    //   'name': 'Win XP/IE8',
    //   'os': 'Windows XP',
    //   'browserName': 'internet explorer',
    //   'version': '8.0'
    // },
    // { DOESN'T WORK
    //   'name': 'Win7/IE8',
    //   'os': 'Windows 7',
    //   'browserName': 'internet explorer',
    //   'version': '8.0'
    // },
    {
      'name': 'Win7 / IE9',
      'platform': 'Windows 7',
      'browserName': 'internet explorer',
      'version': '9.0'
    },
    {
      'name': 'Win8 / IE10',
      'platform': 'Windows 8',
      'browserName': 'internet explorer',
      'version': '10.0'
    },
    {
      'name': 'Win8.1 / IE11',
      'platform': 'Windows 8.1',
      'browserName': 'internet explorer',
      'version': '11.0'
    },
    {
      'name': 'Win10 / Edge 14',
      'platform': 'Windows 10',
      'browserName': 'microsoftedge',
      'version': '14'
    },
    {
      'name': 'Mac10.8 / Chrome 49.0',
      'browserName': 'chrome',
      'platform': 'Mac 10.8',
      'version': '49.0'
    },
    // { DOESN'T WORK
    //   'name': 'Mac10.8 / Firefox 48.0',
    //   'browserName': 'firefox',
    //   'platform': 'Mac 10.8',
    //   'version': '48.0'
    // }

  ],

  // multiCapabilities: [{
  //   browserName: 'firefox',
  //   version: '32',
  //   platform: 'OS X 10.10',
  //   name: "firefox-tests",
  //   shardTestFiles: true,
  //   maxInstances: 25
  // }, {
  //   browserName: 'chrome',
  //   version: '41',
  //   platform: 'Windows 7',
  //   name: "chrome-tests",
  //   shardTestFiles: true,
  //   maxInstances: 25
  // }]

}
