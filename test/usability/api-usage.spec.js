describe('ui-deni-grid - usability / api-usage', function() {

  beforeEach(function() {
    browser.get('https://denimar.github.io/ui-deni-grid/examples/usability/api-usage/');
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
        //expect(json.age).toEqual(28);
      });
  });

});
