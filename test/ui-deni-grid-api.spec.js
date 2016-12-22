describe('ui-deni-grid API', function() {

  beforeEach(function() {
    browser.get('http://localhost:3001/examples/api-usage/index.html');
  });

  it('should test (load, selectRow, getSelectedRow)', function() {
    element(by.id('btnLoad')).click();
    element(by.id('btnSelectThirdRow')).click();
    element(by.id('btnGetSelectedRow')).click();
    element(by.id('memResults')).getAttribute("value")
      .then(function(val) {
        var json = JSON.parse(val);

        expect(json.id).toEqual(4);
        expect(json.eyeColor).toEqual('brown');
        expect(json.name).toEqual('Reba Dickinson');
        expect(json.gender).toEqual('female');
      });
  });

});
