describe('ui-deni-grid.service', function() {

  var uiDeniGridService;

  beforeEach(angular.mock.module('ui-deni-grid')); //Load a mocked module
  //beforeEach(module('ui-deni-grid')); //Load the real module

  beforeEach(inject(function(_uiDeniGridService_) {
    uiDeniGridService = _uiDeniGridService_;
  }));

  it('Sum value testing', function() {
    var value = uiDeniGridService.sum(20, 5);
    expect(value).toEqual(25);
  });

  it('Sum value testing 2', function() {
    var value = uiDeniGridService.sum(15, 1);
    expect(value).toEqual(16);
  });

  it('Sum value testing 3', function() {
    var value = uiDeniGridService.sum(18, 20);
    expect(value).toEqual(38);
  });

});
