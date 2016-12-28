var BROWSER_CHROME = 'chrome';
var BROWSER_FIREFOX = 'firefox';
var BROWSER_SAFARI = 'safari';
var BROWSER_IE = 'internet explorer';
var BROWSER_OPERA = 'opera';

var LINUX = 'Linux';
var PLATFORM_WINDOWSXP = 'Windows XP';
var PLATFORM_WINDOWS7 = 'Windows 7';
var PLATFORM_WINDOWS8 = 'Windows 8';
var PLATFORM_WINDOWS8_1 = 'Windows 8.1';
var PLATFORM_WINDOWS10 = 'Windows 10';
var PLATFORM_MACOS_SIERRA = 'macOS Sierra';
var PLATFORM_OS_EL_CAPITAN = 'OS X El Capitan';
var PLATFORM_OS_YOSEMITE = 'OS X Yosemite';
var PLATFORM_OS_MAVERICKS = 'OS X Mavericks';
var PLATFORM_OS_MOUNTAIN_LION = 'OS X Mountain Lion';

var capabilities = [
  {
      'platform': LINUX,
      'browsers': [
        {
          'name': BROWSER_CHROME,
          'versions': ['48.0', '47.0', '46.0']
        },
        {
          'name': BROWSER_FIREFOX,
          'versions': ['45.0', '44.0']
        },
        {
          'name': BROWSER_OPERA,
          'versions': ['12.15']
        }
      ]
  },
  {
      'platform': PLATFORM_WINDOWSXP,
      'browsers': [
        {
          'name': BROWSER_CHROME,
          'versions': ['49.0', '48.0', '47.0']
        },
        {
          'name': BROWSER_FIREFOX,
          'versions': ['45.0', '44.0']
        },
        {
          'name': BROWSER_IE,
          'versions': ['8.0', '7.0', '6.0']
        },
        {
          'name': BROWSER_OPERA,
          'versions': ['12.12', '12.64']
        }
      ]
  },
  // {
  //     'platform': PLATFORM_WINDOWS7,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['latest', 'latest-1', 'latest-2']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['50.0', '49.0']
  //       }
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWS8,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['latest', 'latest-1', 'latest-2']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['50.0', '49.0']
  //       }
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWS8_1,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['latest', 'latest-1', 'latest-2']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['50.0', '49.0']
  //       }
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWS10,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['latest', 'latest-1', 'latest-2']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['50.0', '49.0']
  //       }
  //     ]
  // },
  //
];

function _getMultiCapabilities() {
  var multiCapabilities = [];

  for (var capabilitiesIndex = 0 ; capabilitiesIndex < capabilities.length ; capabilitiesIndex++) {
    var capability = capabilities[capabilitiesIndex];

    for (var browserIndex = 0 ; browserIndex < capability.browsers.length ; browserIndex++) {
      var browser = capability.browsers[browserIndex];

      for (var browserVersionIndex = 0 ; browserVersionIndex < browser.versions.length ; browserVersionIndex++) {

        multiCapabilities.push({
          'name': capability.platform + ' / ' + browser.name,
          'platform': capability.platform,
          'browserName': browser.name,
          'build': process.env.TRAVIS_BUILD_NUMBER,
          'version': browser.versions[browserVersionIndex]
        });

      }

    }

  }

  return multiCapabilities;

  /*
  return [
    {
      'name': 'Windows 10 / Chrome',
      'platform': PLATFORM_WINDOWS10,
      'browserName': 'chrome',
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'version': 'latest'
    },
    {
      'name': 'Windows 10 / Chrome',
      'platform': PLATFORM_WINDOWS10,
      'browserName': 'chrome',
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'version': 'latest-1'
    }
  ];
  */
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
