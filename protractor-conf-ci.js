var BROWSER_CHROME = 'chrome';
var BROWSER_FIREFOX = 'firefox';
var BROWSER_SAFARI = 'safari';
var BROWSER_IE = 'internet explorer';

var PLATFORM_WINDOWS10 = 'Windows 10';

var capabilities = [
  {
      'os': PLATFORM_WINDOWS10,
      'browsers': [
        {
          'name': BROWSER_CHROME,
          'version': 'latest'
        }
      ]
  },
  /*
  {
      'name': 'Windows 8.1'
  },
  {
      'name': 'Windows 8'
  },
  {
      'name': 'Windows 7'
  },
  {
      'name': 'Windows XP'
  },
  {
      'name': 'Linux'
  }
  */
];

function _getMultiCapabilities() {
  return [
    {
      'name': 'Linux / Chrome',
      'browserName': 'chrome',
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'version': 'latest'
    }
  ];
}

exports.config = {
  sauceUser: 'ui-deni-grid',
  sauceKey: '6b220e08-e488-43c0-982d-b76e0e4b9170',

  specs: ['test/basic/*.spec.js'],
  //specs: ['test/usability/*.spec.js'],

  onPrepare: () => {
    browser.driver.manage().window().maximize();
  },

  jasmineNodeOpts: {
    showColors: true,
    //defaultTimeoutInterval: 360000
    isVerbose: true
  },

  maxInstances: 4,
  maxSessions: 4,
  //restartBrowserBetweenTests: true,
  //allScriptsTimeout: 20000,

  /*
  *************************************************************************************
  * Before set whatever browser here see http://www.protractortest.org/#/browser-support
  *************************************************************************************
  */

  multiCapabilities: _getMultiCapabilities()

  // multiCapabilities: [
  //   {
  //     // by default, these first two browsers will come up in
  //     // Linux if you don't specify an OS
  //     'name': 'Linux / Chrome',
  //     'browserName': 'chrome',
  //     //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //     'build': process.env.TRAVIS_BUILD_NUMBER
  //   },
  //   {
  //     'name': 'Linux / Firefox',
  //     'browserName': 'firefox',
  //     //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //     'build': process.env.TRAVIS_BUILD_NUMBER
  //   },
  //   // { DOESN'T WORK
  //   //   'name': 'Win XP/IE8',
  //   //   'os': 'Windows XP',
  //   //   'browserName': 'internet explorer',
  //   //   'version': '8.0'
  //   // },
  //   // { DOESN'T WORK
  //   //   'name': 'Win7/IE8',
  //   //   'os': 'Windows 7',
  //   //   'browserName': 'internet explorer',
  //   //   'version': '8.0'
  //   // },
  //   // { DOESN'T WORK -- THIS VERSION IS NOT SUPPORTED BY PROTRACTOR (https://github.com/angular/protractor/issues/1540)
  //   //   'name': 'Win7 / IE9',
  //   //   'platform': 'Windows 7',
  //   //   'browserName': 'internet explorer',
  //   //   'version': '9.0',
  //   //   //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //   //   'build': process.env.TRAVIS_BUILD_NUMBER,
  //   // },
  //   // { DOESN'T WORK
  //   //   'name': 'Win7 / Safari',
  //   //   'platform': 'Windows 7',
  //   //   'browserName': 'safari',
  //   //   'version': '5',
  //   //   //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //   //   'build': process.env.TRAVIS_BUILD_NUMBER
  //   // },
  //   {
  //     'name': 'Win8 / IE10',
  //     'platform': 'Windows 8',
  //     'browserName': 'internet explorer',
  //     'version': '10.0',
  //     //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //   },
  //   // { DOESN'T WORK (The problem is entirely due to the change in browser behavior) - I decided to wait until the next future
  //   //   'name': 'Win8.1 / IE11',
  //   //   'platform': 'Windows 8.1',
  //   //   'browserName': 'internet explorer',
  //   //   'version': '11.0',
  //   //   //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //   //   'build': process.env.TRAVIS_BUILD_NUMBER
  //   // },
  //   {
  //     'name': 'Win10 / Edge 14',
  //     'platform': 'Windows 10',
  //     'browserName': 'microsoftedge',
  //     'version': '14',
  //     //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //     'build': process.env.TRAVIS_BUILD_NUMBER
  //   },
  //   {
  //     'name': 'Mac10.8 / Chrome 49.0',
  //     'browserName': 'chrome',
  //     'platform': 'Mac 10.8',
  //     'version': '49.0',
  //     //'build': 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
  //     'build': process.env.TRAVIS_BUILD_NUMBER
  //   },
  //   // { DOESN'T WORK
  //   //   'name': 'Mac10.8 / Firefox 48.0',
  //   //   'browserName': 'firefox',
  //   //   'platform': 'Mac 10.8',
  //   //   'version': '48.0'
  //   // }
  //
  // ],

}
