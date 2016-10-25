(function() {

	angular
		.module('ui-deni-grid')
		.controller('uiDeniGridController', uiDeniGridController);

	function uiDeniGridController($scope, $element, $timeout, uiDeniGridSrv, uiDeniGridUtilSrv, uiDeniGridConstants) {
		this.scope = $scope;
		this.enabled = true;
		this.checkedRecords = [];
		this.filterInfo = null;
		this.searchInfo = null;	
		
		//
		this.loading = false;	

		//
		this.element = $element;	

	    //
	    this.wrapper = this.element.find('.ui-deni-grid-wrapper');
	    this.viewport = this.wrapper.find('.ui-deni-grid-viewport');
	    this.container = this.viewport.find('.ui-deni-grid-container');

	    // *************************************************************************
	    // VARIABLE COLUMNS
	    // *************************************************************************
	    this.colsViewportWrapper = this.container.find('.ui-variable-cols-viewport-wrapper');
	    this.colsViewport = this.colsViewportWrapper.find('.ui-viewport');
	    this.colsContainer = this.colsViewport.find('.ui-container');

	    // header
	    this.headerViewportWrapper = this.colsContainer.find('.ui-header-viewport-wrapper');
		this.headerViewport = this.headerViewportWrapper.find('.ui-header-viewport');
		this.headerContainer = this.headerViewport.find('.ui-header-container');	
		// body
	    this.bodyViewportWrapper = this.colsContainer.find('.ui-body-viewport-wrapper');
		this.bodyViewport = this.bodyViewportWrapper.find('.ui-body-viewport');
		this.bodyContainer = this.bodyViewport.find('.ui-body-container');	
		//footer
		this.footerViewportWrapper = this.colsContainer.find('.ui-footer-viewport-wrapper');
		this.footerViewport = this.footerViewportWrapper.find('.ui-footer-viewport');
		this.footerContainer = this.footerViewport.find('.ui-footer-container');
	    // *************************************************************************
	    // *************************************************************************

	    // *************************************************************************
	    // FIXED COLUMNS
	    // *************************************************************************
	    this.fixedColsViewportWrapper = this.container.find('.ui-fixed-cols-viewport-wrapper');
	    this.fixedColsViewport = this.fixedColsViewportWrapper.find('.ui-viewport');
	    this.fixedColsContainer = this.fixedColsViewport.find('.ui-container');

	    // header    
	    this.fixedColsHeaderViewportWrapper = this.fixedColsContainer.find('.ui-header-viewport-wrapper');
		this.fixedColsHeaderViewport = this.fixedColsHeaderViewportWrapper.find('.ui-header-viewport');
		this.fixedColsHeaderContainer = this.fixedColsHeaderViewport.find('.ui-header-container');	
	    // body	
	    this.fixedColsBodyViewportWrapper = this.fixedColsContainer.find('.ui-body-viewport-wrapper');
		this.fixedColsBodyViewport = this.fixedColsBodyViewportWrapper.find('.ui-body-viewport');
		this.fixedColsBodyContainer = this.fixedColsBodyViewport.find('.ui-body-container');	
	    // footer	
		this.fixedColsFooterViewportWrapper = this.fixedColsContainer.find('.ui-footer-viewport-wrapper');
		this.fixedColsFooterViewport = this.footerViewportWrapper.find('.ui-footer-viewport');
		this.fixedColsFooterContainer = this.footerViewport.find('.ui-footer-container');
	    // *************************************************************************
	    // *************************************************************************

		var currentHeight = this.element.css('height');
		/*
		$timeout(function() {
			if (this.element.css('height') != currentHeight) {
				currentHeight = this.element.css('height');
				this.wrapper.css('height', currentHeight);
				this.element.css('height', currentHeight);
			}
		}, 2000);
		*/

	    //Paging
		this.paging = this.viewport.find('.ui-deni-grid-paging');    

		//Set the default options
		uiDeniGridUtilSrv.setDefaultOptions(this, this.options);
		
		this.options.alldata = []; //It is used when I filter the data and there is a need to know the original data
		
		//Inherit API from ui-deni-view and create some new APIs too		
		this.options.api = _getApi(this, uiDeniGridSrv);

		this.element.show(function(event) {
			///////////////////////////////////////////////////////////////////////////
			//FIXED COLUMNS ///////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
			if (this.options.fixedCols) {
				//
				this.fixedColsViewportWrapper.css('width', this.options.fixedCols.width + 'px');
				//
				this.colsViewportWrapper.css('width', 'calc(100% - ' + this.fixedColsViewportWrapper.css('width') + ')');		
			} else {
				//
				this.fixedColsViewportWrapper.css('display', 'none');
				//
				this.colsViewportWrapper.css('width', '100%');				
			}
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			///
			this.clientWidth = uiDeniGridUtilSrv.getClientWidthDeniGrid(this);	

			///////////////////////////////////////////////////////////////////////////
			//COLUMN HEADERS //////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
			if (this.options.hideHeaders) {
				//
				this.headerViewportWrapper.css('display', 'none');
				this.fixedColsHeaderViewportWrapper.css('display', 'none');
			} else {
				//columnHeaderLevels has a numer greater than one when it has a grouped column headers.
				this.columnHeaderLevels = uiDeniGridUtilSrv.getColumnHeaderLevels(this, this.options.columns);

				if (this.columnHeaderLevels > 1) {
					//realPercentageWidth cause effect only when there are more then one level of columns
					uiDeniGridUtilSrv.setRealPercentageWidths(this.options.columns, '100%');
				}

				//
				uiDeniGridSrv.createColumnHeaders(this, this.options.columns);
				uiDeniGridSrv.createColumnHeadersEvents(this);		

				//the height of the column headers varies when there is grouped column headers (Just in this case)
				this.headerViewportWrapper.css('height', 'calc(' + this.options.columnHeaderHeight + ' * ' + this.columnHeaderLevels + ')');
				this.fixedColsHeaderViewportWrapper.css('height', 'calc(' + this.options.columnHeaderHeight + ' * ' + this.columnHeaderLevels + ')');
			}	
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			///////////////////////////////////////////////////////////////////////////
			//GRID FOOTER /////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
			if (this.options.colLines) {
				this.headerContainer.find('.ui-header-container-column').css('border-right', 'solid 1px silver');
			}
			
			//How many column footer rows is there in the grid (footer.grid different from false)
			this.columnFooterRowsNumberGrid = uiDeniGridUtilSrv.getColumnFooterRowsNumber(this);		
			//How many grouping footer rows is there in the grid (footer.grouping different from false)
			this.columnFooterRowsNumberGrouping = uiDeniGridUtilSrv.getColumnFooterRowsNumber(this, true);		
			//
			this.columnFooterNumber = uiDeniGridUtilSrv.getColumnFooterNumber(this);		

			//Should show the footer?
			if ((uiDeniGridUtilSrv.hasColumnFooter(this)) && (this.columnFooterRowsNumberGrid > 0)) {
				//
				uiDeniGridUtilSrv.createColumnFooters(this, this.footerContainer, this.options.columns, true);
				//How many footers?
				var columnFooterRowsNumber = this.footerContainer.find('.ui-footer-row').length;
				//There is no need to add paadding when a footerRowTemplate was set
				var padding = angular.isDefined(this.options.footerRowTemplate) ? '0px' : '2px';
				this.footerViewportWrapper.css({
					'padding-top': padding,
					//'padding-bottom': padding,			
					//'height': 'calc(' + this.options.columnFooterRowHeight + ' * ' + columnFooterRowsNumber + ' + (' + padding + ' * 2))'
				});
			} else {
				//
				this.footerViewportWrapper.css('display', 'none');
				this.fixedColsFooterViewportWrapper.css('display', 'none');
			}
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			//Paging
			if (this.options.paging) {
				this.paging.css('height', uiDeniGridConstants.PAGING_HEIGHT);
				uiDeniGridUtilSrv.createPagingItems(this, this.paging, this.options.paging);
			}

			this.searchInfo = null; //hold values for render the field values (realce)
			this.searching = false;
			this.resizing = false;

			//This guy manages which items the grid should render
			this.managerRendererItems = new uiDeniGridUtilSrv.ManagerRendererItems(this);

			//Create Events for the ui-deni-view
			uiDeniGridSrv.createUiDeniViewEvents(this);  //TODO: change the name of this method

			//
			uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(this);

			if (this.options.data) {
				this.options.api.loadData(this.options.data);
			} else if ((this.options.url) && (this.options.autoLoad)) {
				this.options.api.load();
			}
		});

	}

	function _getApi(controller, uiDeniGridSrv) {

		return {
			/**
			 *	
			 *
			 */		 
			clearSelections: function() {
	        	uiDeniGridSrv.clearSelections(controller);
			},

			/**
			 *	
			 *
			 */		 
			find: function(valuesToFind, opts) {
				return uiDeniGridSrv.find(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findFirst: function(valuesToFind, opts) {
				return uiDeniGridSrv.findFirst(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findKey: function(keyValue, opts) {
				return uiDeniGridSrv.findKey(controller, keyValue, opts);
			},

			/**
			 *	
			 *
			 */		 
			findLast: function(valuesToFind, opts) {
				return uiDeniGridSrv.findLast(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findNext: function(valuesToFind, opts) {
				return uiDeniGridSrv.findNext(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findPrevious: function(valuesToFind, opts) {
				return uiDeniGridSrv.findPrevious(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			filter: function(valuesToFilter, opts) {
				return uiDeniGridSrv.filter(controller, valuesToFilter, opts);
			},


			/**
			 *	
			 *
			*/		 
	        getChangedRecords: function() {
	        	return uiDeniGridSrv.getChangedRecords(controller);
	        },

			/**
			 *	
			 *
			*/		 
	        getColumn: function(fieldName) {
	        	return uiDeniGridSrv.getColumn(controller, fieldName);
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
				return uiDeniGridSrv.getPageNumber(controller);
			},

			/**
			 *	
			 *
			 */		 
			getRowHeight: function() {
				return uiDeniGridSrv.getRowIndex(controller);
			},

			/**
			 *	
			 *
			*/		 
	        getRowIndex: function(record) {
	        	return uiDeniGridSrv.getRowIndex(controller, record);
	        },


			/**
			 *	
			 *
			*/		 
	        getSelectedRow: function() {
	        	return uiDeniGridSrv.getSelectedRow(controller);
	        },

			/**
			 *	
			 *
			*/		 
	        getSelectedRowIndex: function() {
	        	return uiDeniGridSrv.getSelectedRowIndex(controller);
	        },

			/**
			 *	
			 *
			 */
			isEnableGrouping: function() {
				return uiDeniGridSrv.isEnableGrouping(controller);
			},

			/**
			 *	
			 *
			 */
			isGrouped: function() {
				return uiDeniGridSrv.isGrouped(controller);
			},	        

			/**
			 *	
			 *
			*/		 
			isRowSelected: function(row) {        
	        	return uiDeniGridSrv.isRowSelected(controller, row);
	        },

			/**
			 * @param row {Element|Integer} Can be the rowIndex or a jquery element row
			 * 
			 */
			isRowVisible: function(row) {
				return uiDeniGridSrv.isRowVisible(controller, row);							
			},

			/**
			 *	
			 *
			 */
			load: function() {
				uiDeniGridSrv.load(controller);
			},

			/**
			 *	
			 *
			 */
			loadData: function(data) {
				uiDeniGridSrv.loadData(controller, data);							
			},


			/**
			 *	
			 *
			*/		 
			isHideHeaders: function() {        
	        	return uiDeniGridSrv.isHideHeaders(controller);
	        },

			/**
			 *	
			 *
			 */
			reload: function() {
				return uiDeniGridSrv.reload(controller);
			},

			/**
			 *	
			 *
			 */
			removeRow: function(row) {
				uiDeniGridSrv.removeRow(controller, row);
			},

			/**
			 *	
			 *
			 */
			removeSelectedRows: function() {
				uiDeniGridSrv.removeSelectedRows(controller);
			},

			/**
			 *	
			 *
			*/		 
	        resolveRowElement: function(row) {
	        	return uiDeniGridSrv.resolveRowElement(controller, row);        	
	        },	

			/**
			 *	
			 *
			*/		 
	        resolveRowIndex: function(row) {
	        	return uiDeniGridSrv.resolveRowIndex(controller, row);        	
	        },	


			/**
			 *	
			 *
			 */
			repaint: function() {
				uiDeniGridSrv.repaint(controller);							
			},

			/**
			 *	
			 *
			 */
			repaintRow: function(row) {
				return uiDeniGridSrv.repaintRow(controller, row);							
			},

			/**
			 *	
			 *
			 */
			repaintSelectedRow: function() {
				return uiDeniGridSrv.repaintSelectedRow(controller);
			},


			/**
			 *	
			 *
			 */
			setDisableGrouping: function() {
				uiDeniGridSrv.setDisableGrouping(controller);
			},

			/**
			 *	
			 *
			 */
			setEnableGrouping: function() {
				uiDeniGridSrv.setEnableGrouping(controller);
			},

			/**
			 *	
			 *
			*/		 
			setHideHeaders: function(hideHeaders) {
				return uiDeniGridSrv.setHideHeaders(controller, hideHeaders);
			},

			/**
			 *	
			 *
			 */		 
			selectAll: function() {
	        	uiDeniGridSrv.selectAll(controller);
			},

			/**
			 *	
			 *
			 */		 
			setEnabled: function(enabled) {
				uiDeniGridSrv.setEnabled(controller, enabled);
			},

			/**
			 *	
			 *
			*/		 
	        selectRow: function(row, preventSelecionChange, scrollIntoView) {
	        	uiDeniGridSrv.selectRow(controller, row, preventSelecionChange, scrollIntoView);
	        },

			/**
			 *	
			 *
			 */		 
			setPageNumber: function(pageNumber) {
				uiDeniGridSrv.setPageNumber(controller, pageNumber);
			},

			/**
			 *	
			 *
			 */		 
			setRowHeight: function(rowHeight) {
				uiDeniGridSrv.setRowHeight(controller, rowHeight);
			},

			/**
			 *	
			 *
			 */
			setToogleGrouping: function() {
				uiDeniGridSrv.setToogleGrouping(controller);
			},


			/**
			 *	
			 * holdSelection {boolean} true is default
			*/		 
	        sort: function(sorters, holdSelection) {
	        	controller.options.sorters = uiDeniGridSrv.sort(controller, sorters, holdSelection);
	        	return controller.options.sorters;
	        },

			/**
			 *	
			 *
			*/		 
	        updateSelectedRow: function(json) {
	        	uiDeniGridSrv.updateSelectedRow(controller, json);
	        },

			/**
			 *	
			 *
			*/		 
	        updateCell: function(rowIndex, colIndex, value) {
	        	uiDeniGridSrv.updateCell(controller, rowIndex, colIndex, value);
	        },
			
			/**
			 *	
			 *
			*/		 
	        updateSelectedCell: function(value) {
	        	uiDeniGridSrv.updateSelectedCell(controller, value);
	        }
	    };
	}

})();
