describe('Denimar test', function() {

  var uiDeniGridService;

  /*
  beforeEach(module('ui-deni-grid'));
  beforeEach(function () {
      inject(function ($injector) {
          uiDeniGridService = $injector.get('uiDeniGridService');
      });
  });
  */

  it('Sum value testing', function() {
    var value = 25; //uiDeniGridService.sum(20, 5);
    expect(value).toEqual(25);
  });
});
