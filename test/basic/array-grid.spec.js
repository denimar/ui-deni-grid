var testHelper = require('../util/test-helper');

describe('ui-deni-grid - basic / array-grid', function() {

  const GRID_HEIGHT = 400;
  const GRID_WIDTH = 900;
  const DEFAULT_COLUMN_HEADER_HEIGHT = 25;
  const DEFAULT_ROW_HEIGHT = 22;

  var gridElements;
  var initPromises = [];

  beforeEach(function() {
    browser.get('https://denimar.github.io/ui-deni-grid/examples/basic/array-grid/');
    testHelper.init();
    gridElements = testHelper.getGridElements();
    initPromises = [
      testHelper.resizeWidthGrid(GRID_WIDTH),
      testHelper.resizeHeightGrid(GRID_HEIGHT),
      testHelper.getBasicInfosGrid(),
    ];
  });

  it('should check the measurements of the inner elements', function() {
    var promises = initPromises.concat([
      gridElements.uiHeaderViewportWrapper.getSize(),
      gridElements.uiBodyViewportWrapper.getSize(),
      gridElements.uiBodyViewport.getSize(),
      gridElements.uiBodyContainer.getSize(),
    ]);

    protractor.promise.all(promises).then(function(results) {
      var basicInfosGrid = results[2];
      var uiHeaderViewportWrapperSize = results[3];
      var uiBodyViewportWrapperSize = results[4];
      var uiBodyViewportSize = results[5];
      var uiBodyContainerSize = results[6];

      expect(uiHeaderViewportWrapperSize.width).toEqual(GRID_WIDTH);
      expect(uiHeaderViewportWrapperSize.height).toEqual(DEFAULT_COLUMN_HEADER_HEIGHT);

      expect(uiBodyViewportWrapperSize.width).toEqual(GRID_WIDTH);
      expect(uiBodyViewportWrapperSize.height).toEqual(GRID_HEIGHT - DEFAULT_COLUMN_HEADER_HEIGHT + 1);

      expect(uiBodyViewportSize.width).toEqual(uiBodyViewportWrapperSize.width);
      expect(uiBodyViewportSize.height).toEqual(uiBodyViewportWrapperSize.height);

      expect(uiBodyContainerSize.width).toEqual(uiBodyViewportWrapperSize.width - basicInfosGrid.verticalScrollWidth);
      expect(uiBodyContainerSize.height).toEqual(DEFAULT_ROW_HEIGHT * 5 + 2); //5=Lines Count, 2=borders
    });
  });

  it('should confers the quantity of the inner elements', function() {
    var promises = initPromises.concat([
      gridElements.uiRow.count(),
      gridElements.uiCell.count()
    ]);

    protractor.promise.all(promises).then(function(results) {
      var uiRowCount = results[3];
      var uiCellCount = results[4];

      //rowCount
      expect(uiRowCount).toEqual(5);

      //cellCount
      expect(uiCellCount).toEqual(15);

    });
  });

  it('should check other attributes', function() {
    var promises = initPromises.concat([
      testHelper.selectGridRow(3),
      testHelper.getSelectedRowIndex(),
      gridElements.uiBodyContainer.getAttribute('offsetLeft'),
      gridElements.uiBodyContainer.getAttribute('offsetTop'),
      gridElements.uiFirstRow.getAttribute('offsetLeft'),
      gridElements.uiFirstRow.getAttribute('offsetTop'),
      gridElements.uiBodyContainer.getAttribute('offsetWidth'),
      testHelper.getSumHeadersColumnsWidth(),
      testHelper.getSumFirstRowColumnsWidth(),
    ]);

    protractor.promise.all(promises).then(function(results) {
      var selectedRowIndex = results[4];
      var uiBodyContainerOffsetLeft = results[5];
      var uiBodyContainerOffsetTop = results[6];
      var uiFirstRowOffsetLeft = results[7];
      var uiFirstRowOffsetTop = results[8];
      var uiBodyContainerSize = parseInt(results[9]);
      var getSumHeadersColumnsWidth = results[10];
      var getSumFirstRowColumnsWidth = results[11];

      // //rowIndex
      expect(selectedRowIndex).toEqual(3);

      //ui-body-container offsetTop and offsetLeft
      expect(uiBodyContainerOffsetLeft).toEqual('0');
      expect(uiBodyContainerOffsetTop).toEqual('0');

      //first row offsetTop and offsetLeft
      expect(uiFirstRowOffsetLeft).toEqual('0');
      expect(uiFirstRowOffsetTop).toEqual('0');

      //check the header columns widths (the sum of them must be igual uiBodyContainerSize.width)
      expect(getSumHeadersColumnsWidth).toEqual(uiBodyContainerSize);

      //check the first row columns widths (the sum of them must be igual uiBodyContainerSize.width)
      expect(getSumFirstRowColumnsWidth).toEqual(uiBodyContainerSize);

    });
  });


});
