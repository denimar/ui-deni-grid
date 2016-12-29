describe('Denimar test', function() {

  var uiDeniGridService;

  beforeEach(module('ui-deni-grid'));
  beforeEach(function () {
      inject(function ($injector) {
          uiDeniGridService = $injector.get('uiDeniGridService');
      });
  });

  it('Sum value testing', function() {
    var value = uiDeniGridService.sum(10, 8);
    expect(value).toEqual(18);
  });
});
