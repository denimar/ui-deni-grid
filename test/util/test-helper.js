
module.exports = {

  init: _init,
  getSumFirstRowColumnsWidth: _getSumFirstRowColumnsWidth,
  getGridElements: _getGridElements,
  getSumHeadersColumnsWidth: _getSumHeadersColumnsWidth,
  resizeWidthGrid: _resizeWidthGrid,
  resizeHeightGrid: _resizeHeightGrid,
  selectGridRow: _selectGridRow,
  getBasicInfosGrid: _getBasicInfosGrid,
  getElementWidth: _getElementWidth,
  getSelectedRowIndex: _getSelectedRowIndex,
  getVerticalScrollWidth: _getVerticalScrollWidth,

};

//////////////////////////////////////////////////////////
// IMPLEMENTATION BELOW
//////////////////////////////////////////////////////////
var gridElements = {
  uiBodyViewport: null
}

var uiBodyContainerSelector = '.ui-deni-grid-viewport .ui-variable-cols-viewport-wrapper .ui-body-viewport-wrapper .ui-body-viewport .ui-body-container';

function _getGridElements() {
  return gridElements;
}

function _init() {
  gridElements.uiVariableColsVewportWrapper = element(by.css('.ui-deni-grid-viewport .ui-variable-cols-viewport-wrapper'));

  gridElements.uiHeaderViewportWrapper = gridElements.uiVariableColsVewportWrapper.element(by.css('.ui-header-viewport-wrapper'));
  gridElements.uiHeaderViewport = gridElements.uiHeaderViewportWrapper.element(by.css('.ui-header-viewport'));
  gridElements.uiHeaderContainer = gridElements.uiHeaderViewport.element(by.css('.ui-header-container'));
  gridElements.uiHeaderContainerColumn = element.all(by.css('.ui-deni-grid-viewport .ui-variable-cols-viewport-wrapper .ui-header-viewport-wrapper .ui-header-container-column'));

  gridElements.uiBodyViewportWrapper = gridElements.uiVariableColsVewportWrapper.element(by.css('.ui-body-viewport-wrapper'));
  gridElements.uiBodyViewport = gridElements.uiBodyViewportWrapper.element(by.css('.ui-body-viewport'));
  gridElements.uiBodyContainer = gridElements.uiBodyViewport.element(by.css('.ui-body-container'));
  gridElements.uiRow = element.all(by.css(uiBodyContainerSelector + ' .ui-row'));
  gridElements.uiFirstRow = gridElements.uiRow.get(0);
  gridElements.uiCell = element.all(by.css(uiBodyContainerSelector + ' .ui-cell'));
  gridElements.uiCellFirstRow = element.all(by.css(uiBodyContainerSelector + ' .ui-row:first-child .ui-cell'));
}

function _resizeWidthGrid(width) {
  return new Promise(function(success) {
    browser.executeScript('angular.element("#deniGrid").width(' + width + ');').then(function(){
      browser.executeScript('angular.element("#deniGrid").api.repaint();').then(function() {
        success();
      });
    });
  });
}

function _resizeHeightGrid(height) {
  return new Promise(function(success) {
    browser.executeScript('angular.element("#deniGrid").height(' + height + ');').then(function(){
      browser.executeScript('angular.element("#deniGrid").api.repaint();').then(function(){
        success();
      });
    });
  });
}

function _selectGridRow(rowIndex) {
  return new Promise(function(success) {
    browser.executeScript('angular.element("#deniGrid").api.selectRow(' + rowIndex + ');').then(function(){
      success();
    });
  });
}

function _getBasicInfosGrid() {
  return new Promise(function(success) {
    var info = {};

    _getVerticalScrollWidth().then(function(verticalScrollWidth) {
      info.verticalScrollWidth = verticalScrollWidth;
      success(info);
    });

  });
}

function _getVerticalScrollWidth() {

  return new Promise(function(success) {
    gridElements.uiBodyViewport.getAttribute('offsetWidth').then(function(offsetWidth) {
      gridElements.uiBodyViewport.getAttribute('scrollWidth').then(function(scrollWidth) {
        success(offsetWidth - scrollWidth);
      });
    });

  });
}

function _getElementWidth(cssSelector) {
  return new Promise(function(success) {
    var elem = element(by.css(cssSelector));
    elem.getSize().then(function(sizeEle) {
      success(sizeEle.width);
    });

  });
}

function _getSelectedRowIndex() {
  return new Promise(function(success) {
    var elem = element(by.css(uiBodyContainerSelector + ' .ui-row.selected'));
    elem.getAttribute('rowindex').then(function(rowIndex) {
      success(parseInt(rowIndex));
    });
  });
}

function _getSumHeadersColumnsWidth() {
  return new Promise(function(success) {
    var colIndex = 0;
    var sumWidths = 0;
    gridElements.uiHeaderContainerColumn.map(function (elm) {
      elm.getSize().then(function(elmSize) {
        sumWidths += elmSize.width;
        if (colIndex ===  2) {
          success(sumWidths);
        }
        colIndex++;
      });
    });
  });
}

function _getSumFirstRowColumnsWidth() {
  return new Promise(function(success) {
    var colIndex = 0;
    var sumWidths = 0;
    gridElements.uiCellFirstRow.map(function (elm) {
      elm.getSize().then(function(elmSize) {
        sumWidths += elmSize.width;
        if (colIndex ===  2) {
          success(sumWidths);
        }
        colIndex++;
      });
    });
  });
}
