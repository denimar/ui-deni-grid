/*
*************************************************************************************
*  Before set whatever browser here see:
*  http://www.protractortest.org/#/browser-support and https://saucelabs.com/platforms
*************************************************************************************
*/

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
  // {
  //     'platform': LINUX,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['48.0', '47.0', '46.0']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['45.0', '44.0']
  //       },
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWSXP,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['49.0', '48.0', '47.0']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['45.0', '44.0']
  //       },
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWS7,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['49.0', '48.0', '47.0']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['45.0', '44.0']
  //       },
  //       {
  //         'name': BROWSER_IE,
  //         'versions': ['11', '10']
  //       }
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWS8,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['55.0', '54']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['46.0', '45.0']
  //       },
  //       {
  //         'name': BROWSER_IE,
  //         'versions': ['10']
  //       }
  //     ]
  // },
  // {
  //     'platform': PLATFORM_WINDOWS8_1,
  //     'browsers': [
  //       {
  //         'name': BROWSER_CHROME,
  //         'versions': ['55.0', '54']
  //       },
  //       {
  //         'name': BROWSER_FIREFOX,
  //         'versions': ['46.0', '45.0']
  //       },
  //       {
  //         'name': BROWSER_IE,
  //         'versions': ['11']
  //       }
  //     ]
  // },
  {
      'platform': PLATFORM_WINDOWS10,
      'browsers': [
        {
          'name': BROWSER_CHROME,
          'versions': ['latest', 'latest-1']
        },
        {
          'name': BROWSER_FIREFOX,
          'versions': ['latest', 'latest-1']
        },
        {
          'name': BROWSER_IE,
          'versions': ['latest', 'latest-1']
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
}

module.exports = {
  getMultiCapabilities: _getMultiCapabilities
};
