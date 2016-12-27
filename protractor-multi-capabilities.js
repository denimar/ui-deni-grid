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
      'build': process.env.TRAVIS_BUILD_NUMBER
    }
  ];
}

module.exports = function() {
  getMultiCapabilities: _getMultiCapabilities
}
