describe('ui-deni-grid.service', function() {

  var homeService;

  beforeEach(angular.mock.module('ui-deni-grid')); //Load a mocked module

  beforeEach(inject(function(_uiDeniGridService_) {
    uiDeniGridService = _uiDeniGridService_;
  }));

  it('should sum 20 and 5', function() {
    var value = uiDeniGridService.sum(20, 5);
    expect(value).toEqual(25);
  });

  it('should sum 15 and 1', function() {
    var value = uiDeniGridService.sum(15, 1);
    expect(value).toEqual(16);
  });

  it('should sum 18 and 20', function() {
    var value = uiDeniGridService.sum(18, 20);
    expect(value).toEqual(38);
  });

  it('should sum 7 and 2', function() {
    var value = uiDeniGridService.sum(7, 2);
    expect(value).toEqual(9);
  });

  it('should sum 13 and 14', function() {
    var value = uiDeniGridService.sum(13, 14);
    expect(value).toEqual(27);
  });

});
