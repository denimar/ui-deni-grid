
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/*spec.js'],
  onPrepare: () => {
    browser.driver.manage().window().maximize();
  }
}
