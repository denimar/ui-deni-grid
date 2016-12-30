describe('ui-deni-grid.service', function() {

  var uiDeniGridService;

  beforeEach(angular.mock.module('ui-deni-grid')); //Load a mocked module
  //beforeEach(module('ui-deni-grid')); //Load the real module

  beforeEach(inject(function(_uiDeniGridService_) {
    uiDeniGridService = _uiDeniGridService_;
  }));

  it('0000000', function() {
    var value = uiDeniGridService.sum(20, 5);
    expect(value).toEqual(25);
  });

  it('aaaaaaaaaaaaa', function() {
    var value = uiDeniGridService.sum(20, 5);
    expect(value).toEqual(25);
  });

  it('bbbbbbbbbbbb', function() {
    var value = uiDeniGridService.sum(15, 1);
    expect(value).toEqual(16);
  });

  it('cccccccccccccc', function() {
    var value = uiDeniGridService.sum(18, 20);
    expect(value).toEqual(39);
  });

  it('ddddddddddddd', function() {
    var value = uiDeniGridService.sum(18, 20);
    expect(value).toEqual(38);
  });

  it('eeeeeeeeeeeee', function() {
    var value = uiDeniGridService.sum(18, 20);
    expect(value).toEqual(38);
  });

  it('ffffffffffff', function() {
    var value = uiDeniGridService.sum(18, 20);
    expect(value).toEqual(38);
  });

});
