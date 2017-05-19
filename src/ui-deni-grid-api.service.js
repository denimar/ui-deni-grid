(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.service('uiDeniGridApiService', uiDeniGridApiService);

  uiDeniGridApiService.$inject = ['uiDeniGridService'];

	function uiDeniGridApiService(uiDeniGridService) {
		var vm = this;

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
          uiDeniGridService.selectCell(controller, row, col, preventSelecionChange, scrollIntoView);
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

    //
    vm.implementApi = function(controller, element, uiDeniGridService) {

      element.each(function() {
          angular.element(this).init.prototype.api = _getApi(controller, uiDeniGridService);
      });

    };

  }

})();
