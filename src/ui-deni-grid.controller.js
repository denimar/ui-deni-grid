(function() {

  'use strict';

  angular
    .module('ui-deni-grid')
    .controller('uiDeniGridController', uiDeniGridController);

  function uiDeniGridController($scope, $element, $timeout, uiDeniGridService, uiDeniGridHelperService, uiDeniGridConstant, uiDeniGridEventsService, uiDeniGridApiService) {
    var vm = this;
    vm.scope = $scope;
    vm.enabled = true;
    vm.checkedRecords = [];
    vm.searchInfo = null;

    //
    vm.loading = false;

    //
    vm.element = $element;

    vm.show = function() {
      //
      vm.wrapper = vm.element.find('.ui-deni-grid-wrapper');
      vm.viewport = vm.wrapper.find('.ui-deni-grid-viewport');
      vm.container = vm.viewport.find('.ui-deni-grid-container');

      // *************************************************************************
      // VARIABLE COLUMNS
      // *************************************************************************
      vm.colsViewportWrapper = vm.container.find('.ui-variable-cols-viewport-wrapper');
      vm.colsViewport = vm.colsViewportWrapper.find('.ui-viewport');
      vm.colsContainer = vm.colsViewport.find('.ui-container');

      // header
      vm.headerViewportWrapper = vm.colsContainer.find('.ui-header-viewport-wrapper');
      vm.headerViewport = vm.headerViewportWrapper.find('.ui-header-viewport');
      vm.headerContainer = vm.headerViewport.find('.ui-header-container');
      // body
      vm.bodyViewportWrapper = vm.colsContainer.find('.ui-body-viewport-wrapper');
      vm.bodyViewport = vm.bodyViewportWrapper.find('.ui-body-viewport');
      vm.bodyContainer = vm.bodyViewport.find('.ui-body-container');
      //footer
      vm.footerViewportWrapper = vm.colsContainer.find('.ui-footer-viewport-wrapper');
      vm.footerViewport = vm.footerViewportWrapper.find('.ui-footer-viewport');
      vm.footerContainer = vm.footerViewport.find('.ui-footer-container');
      // *************************************************************************
      // *************************************************************************

      // *************************************************************************
      // FIXED COLUMNS
      // *************************************************************************
      vm.fixedColsViewportWrapper = vm.container.find('.ui-fixed-cols-viewport-wrapper');
      vm.fixedColsViewport = vm.fixedColsViewportWrapper.find('.ui-viewport');
      vm.fixedColsContainer = vm.fixedColsViewport.find('.ui-container');

      // header
      vm.fixedColsHeaderViewportWrapper = vm.fixedColsContainer.find('.ui-header-viewport-wrapper');
      vm.fixedColsHeaderViewport = vm.fixedColsHeaderViewportWrapper.find('.ui-header-viewport');
      vm.fixedColsHeaderContainer = vm.fixedColsHeaderViewport.find('.ui-header-container');
      // body
      vm.fixedColsBodyViewportWrapper = vm.fixedColsContainer.find('.ui-body-viewport-wrapper');
      vm.fixedColsBodyViewport = vm.fixedColsBodyViewportWrapper.find('.ui-body-viewport');
      vm.fixedColsBodyContainer = vm.fixedColsBodyViewport.find('.ui-body-container');
      // footer
      vm.fixedColsFooterViewportWrapper = vm.fixedColsContainer.find('.ui-footer-viewport-wrapper');
      vm.fixedColsFooterViewport = vm.footerViewportWrapper.find('.ui-footer-viewport');
      vm.fixedColsFooterContainer = vm.footerViewport.find('.ui-footer-container');
      // *************************************************************************
      // *************************************************************************

      //Set the controller to the service of the events. Always there'll be one controller to eache uiDeniGridEventsService
      uiDeniGridEventsService.setController(vm);

      var currentHeight = vm.element.css('height');
      /*
      $timeout(function() {
      	if (vm.element.css('height') != currentHeight) {
      		currentHeight = vm.element.css('height');
      		vm.wrapper.css('height', currentHeight);
      		vm.element.css('height', currentHeight);
      	}
      }, 2000);
      */

      //Paging
      vm.paging = vm.viewport.find('.ui-deni-grid-paging');

      //Set the default options
      uiDeniGridHelperService.setDefaultOptions(vm, vm.options);

      //
      uiDeniGridHelperService.ckeckInitialValueFilter(vm, vm.options.columns);

      //
      vm.options.alldata = []; //It is used when I filter the data and there is a need to know the original data

      //Implement the ui-deni-grid's API
      uiDeniGridApiService.implementApi(vm, vm.element, uiDeniGridService);

      ///////////////////////////////////////////////////////////////////////////
      //FIXED COLUMNS ///////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      if (vm.options.fixedCols) {
        //
        vm.fixedColsViewportWrapper.css('width', vm.options.fixedCols.width + 'px');
        //
        vm.colsViewportWrapper.css('width', 'calc(100% - ' + vm.fixedColsViewportWrapper.css('width') + ')');
      } else {
        //
        vm.fixedColsViewportWrapper.css('display', 'none');
        //
        vm.colsViewportWrapper.css('width', '100%');
      }
      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////

      ///
      vm.clientWidth = uiDeniGridHelperService.getClientWidthDeniGrid(vm);

      ///////////////////////////////////////////////////////////////////////////
      //COLUMN HEADERS //////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      if (vm.options.hideHeaders) {
        //
        vm.headerViewportWrapper.css('display', 'none');
        vm.fixedColsHeaderViewportWrapper.css('display', 'none');
      } else {
        //columnHeaderLevels has a numer greater than one when it has a grouped column headers.
        vm.columnHeaderLevels = uiDeniGridHelperService.getColumnHeaderLevels(vm, vm.options.columns);

        if (vm.columnHeaderLevels > 1) {
          //realPercentageWidth cause effect only when there are more then one level of columns
          uiDeniGridHelperService.setRealPercentageWidths(vm.options.columns, '100%');
        }

        //
        uiDeniGridService.createColumnHeaders(vm, vm.options.columns);
        uiDeniGridService.createColumnHeadersEvents(vm);

        //the height of the column headers varies when there is grouped column headers (Just in this case)
        vm.headerViewportWrapper.css('height', 'calc(' + vm.options.columnHeaderHeight + ' * ' + vm.columnHeaderLevels + ')');
        vm.fixedColsHeaderViewportWrapper.css('height', 'calc(' + vm.options.columnHeaderHeight + ' * ' + vm.columnHeaderLevels + ')');
      }
      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////////////////////////
      //GRID FOOTER /////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////
      if (vm.options.colLines) {
        vm.headerContainer.find('.ui-header-container-column').css('border-right', 'solid 1px silver');
      }

      //How many column footer rows is there in the grid (footer.grid different from false)
      vm.columnFooterRowsNumberGrid = uiDeniGridHelperService.getColumnFooterRowsNumber(vm);
      //How many grouping footer rows is there in the grid (footer.grouping different from false)
      vm.columnFooterRowsNumberGrouping = uiDeniGridHelperService.getColumnFooterRowsNumber(vm, true);
      //
      vm.columnFooterNumber = uiDeniGridHelperService.getColumnFooterNumber(vm);

      //Should show the footer?
      if ((uiDeniGridHelperService.hasColumnFooter(vm)) && (vm.columnFooterRowsNumberGrid > 0)) {
        //
        uiDeniGridHelperService.createColumnFooters(vm, vm.footerContainer, vm.options.columns, true);
        //How many footers?
        var columnFooterRowsNumber = vm.footerContainer.find('.ui-footer-row').length;
        //There is no need to add paadding when a footerRowTemplate was set
        var padding = angular.isDefined(vm.options.footerRowTemplate) ? '0px' : '2px';
        vm.footerViewportWrapper.css({
          'padding-top': padding,
          //'padding-bottom': padding,
          //'height': 'calc(' + vm.options.columnFooterRowHeight + ' * ' + columnFooterRowsNumber + ' + (' + padding + ' * 2))'
        });
      } else {
        //
        vm.footerViewportWrapper.css('display', 'none');
        vm.fixedColsFooterViewportWrapper.css('display', 'none');
      }
      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////

      //Paging
      if (vm.options.paging) {
        vm.paging.css('height', uiDeniGridConstant.PAGING_HEIGHT);
        uiDeniGridHelperService.createPagingItems(vm, vm.paging, vm.options.paging);
      }

      vm.searchInfo = null; //hold values for render the field values (realce)
      vm.searching = false;
      vm.resizing = false;

      //This guy manages which items the grid should render
      vm.managerRendererItems = new uiDeniGridHelperService.ManagerRendererItems(vm);

      //
      uiDeniGridHelperService.remakeHeightBodyViewportWrapper(vm);

      if (vm.options.data) {
        vm.element.api.loadData(vm.options.data);
      } else if ((vm.options.url) && (vm.options.autoLoad)) {
        vm.element.api.load();
      }
      _checkSize(vm, uiDeniGridHelperService);
    };

  }

  /*
   *
   *
   */
  function _checkSize(controller, uiDeniGridHelperService) {
    controller.scope.$watch(
      function() {
        return {
          width: controller.element.width(),
          height: controller.element.height(),
        };
      },
      function(newValue, oldValue) {
        if (newValue !== oldValue) {
          let isInvisible = ((controller.element.css('display') === 'none') || (controller.element.css('visibility') === 'hidden'));
          if ((!isInvisible) && (controller.options.data)) {
            uiDeniGridHelperService.adjustAllColumnWidtsAccordingColumnHeader(controller);
            controller.element.api.repaint();
          }
        }
      }, //listener
      true //deep watch
    );

    angular.element(window).on('resize', function() {
      controller.scope.$apply();
    });
  }


  function _getApi(controller, uiDeniGridService) {

    return {
      /**
       *
       *
       */
      clearSelections: function() {
        uiDeniGridService.clearSelections(controller);
      },

      /**
       *
       *
       */
      find: function(valuesToFind, opts) {
        return uiDeniGridService.find(controller, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findFirst: function(valuesToFind, opts) {
        return uiDeniGridService.findFirst(controller, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findKey: function(keyValue, opts) {
        return uiDeniGridService.findKey(controller, keyValue, opts);
      },

      /**
       *
       *
       */
      findLast: function(valuesToFind, opts) {
        return uiDeniGridService.findLast(controller, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findNext: function(valuesToFind, opts) {
        return uiDeniGridService.findNext(controller, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findPrevious: function(valuesToFind, opts) {
        return uiDeniGridService.findPrevious(controller, valuesToFind, opts);
      },

      /**
       *
       *
       */
      filter: function(filterModel, opts) {
        return uiDeniGridService.filter(controller, filterModel, opts);
      },


      /**
       *
       *
       */
      getChangedRecords: function() {
        return uiDeniGridService.getChangedRecords(controller);
      },

      /**
       *
       *
       */
      getColumn: function(fieldName) {
        return uiDeniGridService.getColumn(controller, fieldName);
      },


      /**
       *
       *
       */
      getEnabled: function(enabled) {
        return controller.enabled;
      },

      /**
       *
       *
       */
      getPageNumber: function() {
        return uiDeniGridService.getPageNumber(controller);
      },

      /**
       *
       *
       */
      getRowHeight: function() {
        return uiDeniGridService.getRowIndex(controller);
      },

      /**
       *
       *
       */
      getRowIndex: function(record) {
        return uiDeniGridService.getRowIndex(controller, record);
      },


      /**
       *
       *
       */
      getSelectedRow: function() {
        return uiDeniGridService.getSelectedRow(controller);
      },

      /**
       *
       *
       */
      getSelectedRowIndex: function() {
        return uiDeniGridService.getSelectedRowIndex(controller);
      },

      /**
       *
       *
       */
      isEnableGrouping: function() {
        return uiDeniGridService.isEnableGrouping(controller);
      },

      /**
       *
       *
       */
      isGrouped: function() {
        return uiDeniGridService.isGrouped(controller);
      },

      /**
       *
       *
       */
      isRowSelected: function(row) {
        return uiDeniGridService.isRowSelected(controller, row);
      },

      /**
       * @param row {Element|Integer} Can be the rowIndex or a jquery element row
       *
       */
      isRowVisible: function(row) {
        return uiDeniGridService.isRowVisible(controller, row);
      },

      /**
       *
       *
       */
      load: function() {
        uiDeniGridService.load(controller);
      },

      /**
       *
       *
       */
      loadData: function(data) {
        uiDeniGridService.loadData(controller, data);
      },


      /**
       *
       *
       */
      isHideHeaders: function() {
        return uiDeniGridService.isHideHeaders(controller);
      },

      /**
       *
       *
       */
      reload: function() {
        return uiDeniGridService.reload(controller);
      },

      /**
       *
       *
       */
      removeRow: function(row) {
        uiDeniGridService.removeRow(controller, row);
      },

      /**
       *
       *
       */
      removeSelectedRows: function() {
        uiDeniGridService.removeSelectedRows(controller);
      },

      /**
       *
       *
       */
      resolveRowElement: function(row) {
        return uiDeniGridService.resolveRowElement(controller, row);
      },

      /**
       *
       *
       */
      resolveRowIndex: function(row) {
        return uiDeniGridService.resolveRowIndex(controller, row);
      },


      /**
       * forceRepaint force repaint all visible rows
       *
       */
      repaint: function(forceRepaint) {
        uiDeniGridService.repaint(controller, forceRepaint);
      },

      /**
       *
       *
       */
      repaintRow: function(row) {
        return uiDeniGridService.repaintRow(controller, row);
      },

      /**
       *
       *
       */
      repaintSelectedRow: function() {
        return uiDeniGridService.repaintSelectedRow(controller);
      },


      /**
       *
       *
       */
      setDisableGrouping: function() {
        uiDeniGridService.setDisableGrouping(controller);
      },

      /**
       *
       *
       */
      setEnableGrouping: function() {
        uiDeniGridService.setEnableGrouping(controller);
      },

      /**
       *
       *
       */
      setHideHeaders: function(hideHeaders) {
        return uiDeniGridService.setHideHeaders(controller, hideHeaders);
      },

      /**
       *
       *
       */
      selectAll: function() {
        uiDeniGridService.selectAll(controller);
      },

      /**
       *
       *
       */
      setEnabled: function(enabled) {
        uiDeniGridService.setEnabled(controller, enabled);
      },

      /**
       *
       *
       */
      selectRow: function(row, preventSelecionChange, scrollIntoView) {
        uiDeniGridService.selectRow(controller, row, preventSelecionChange, scrollIntoView);
      },

      /**
       *
       *
       */
      selectCell: function(row, col, preventSelecionChange, scrollIntoView) {
        uiDeniGridService.selectRow(controller, row, col, preventSelecionChange, scrollIntoView);
      },

      /**
       *
       *
       */
      setPageNumber: function(pageNumber) {
        uiDeniGridService.setPageNumber(controller, pageNumber);
      },

      /**
       *
       *
       */
      setRowHeight: function(rowHeight) {
        uiDeniGridService.setRowHeight(controller, rowHeight);
      },

      /**
       *
       *
       */
      setToogleGrouping: function() {
        uiDeniGridService.setToogleGrouping(controller);
      },


      /**
       *
       * holdSelection {boolean} true is default
       */
      sort: function(sorters, holdSelection) {
        controller.options.sorters = uiDeniGridService.sort(controller, sorters, holdSelection);
        return controller.options.sorters;
      },

      /**
       *
       *
       */
      updateSelectedRow: function(json) {
        uiDeniGridService.updateSelectedRow(controller, json);
      },

      /**
       *
       *
       */
      updateCell: function(rowIndex, colIndex, value) {
        uiDeniGridService.updateCell(controller, rowIndex, colIndex, value);
      },

      /**
       *
       *
       */
      updateSelectedCell: function(value) {
        uiDeniGridService.updateSelectedCell(controller, value);
      }
    };
  }

})();
