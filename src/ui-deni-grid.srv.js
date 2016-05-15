/**
 *
 *
 */
angular.module('ui-deni-grid').service('uiDeniGridSrv', function($compile, $timeout, $templateCache, $q, $http, $filter, uiDeniGridUtilSrv, uiDeniGridConstants) {
	var me = this;


	/**
	 *
	 * remove all selections in the grid
	 *
	 */
	 me.clearSelections = function(controller) {
	 	controller.bodyViewport.find('.ui-row.selected').removeClass('selected'); 
	 	controller.fixedColsBodyViewport.find('.ui-row.selected').removeClass('selected'); 

	 	controller.bodyViewport.find('.ui-cell.selected').removeClass('selected'); 
	 	controller.fixedColsBodyViewport.find('.ui-cell.selected').removeClass('selected'); 	 	
	 }

	/**
	 *
	 * select all records in the grid
	 *
	 */
	 me.selectAll = function(controller) {
		if (controller.options.multiSelect) {
			controller.bodyViewport.find('.ui-row.selected').addClass('selected'); 		
	 		controller.bodyViewport.find('.ui-cell.selected').addClass('selected'); 			
		} else {
			throw new Error('"selectAll" : to use selectAll method you must set multiSelect property to true!');
		}
	 }


	/**
	 *
	 * @param headerContainerColumnRow optional comes filled just when we creating sub columns (grouped column headers)
	 */
	me.createColumnHeaders = function(controller, columnsToCreate, headerContainerColumnRow, level, colIndexStart) {
		var columns = [];

		var createDivHeaderContainerColumnRow = function(headerContainerColumn) {
			//ui-header-container-column-row
			var divHeaderContainerColumnRow = $(document.createElement('div'));
			divHeaderContainerColumnRow.addClass('ui-header-container-column-row');
			divHeaderContainerColumnRow.css('height', controller.options.columnHeaderHeight);
			headerContainerColumn.append(divHeaderContainerColumnRow);

			return divHeaderContainerColumnRow;
		}

		if (controller.options.fixedCols) {
			angular.copy(columnsToCreate, columns);			

			//Row Number?
			if (controller.options.fixedCols.rowNumber) {
				columns.splice(0, 0, {
					width: uiDeniGridConstants.FIXED_COL_ROWNUMBER_WIDTH,
					isFixedColumn: true
				});
			}	

			//Indicator?
			if (controller.options.fixedCols.indicator) {
				columns.splice(0, 0, {
					width: uiDeniGridConstants.FIXED_COL_INDICATOR_WIDTH,
					isFixedColumn: true
				});
			}	

			//CheckBox?
			if (controller.options.fixedCols.checkbox) {
				columns.splice(0, 0, {
					width: uiDeniGridConstants.FIXED_COL_CHECKBOX_WIDTH,
					isFixedColumn: true,
					isCheckbox: true
				});
			}	
		} else {
			columns = columnsToCreate;
		}

		//
		var clientWidthParent = headerContainerColumnRow ? headerContainerColumnRow.width() : controller.clientWidth;
		//
		//var columnHeaderLevels = uiDeniGridUtilSrv.getColumnHeaderLevels(me, me.options.columns);
		//
		var currentLevel = level || 1;

		var colIndex = colIndexStart || 0;

		//
		for (var index = 0 ; index < columns.length ; index++) {
			var column = columns[index];

			//ui-header-container-column
			var divHeaderContainerColumn = $(document.createElement('div'));
			divHeaderContainerColumn.css('width', uiDeniGridUtilSrv.getRealColumnWidth(controller, column.width, clientWidthParent));
			divHeaderContainerColumn.addClass('ui-header-container-column');
			divHeaderContainerColumn.attr('colindex', colIndex);
			if (angular.isDefined(headerContainerColumnRow)) {
				if (index == 0) {
					divHeaderContainerColumn.addClass('first-subcolumn');				
				} else if (index == columns.length - 1) {
					divHeaderContainerColumn.addClass('last-subcolumn');				
				}
			}


			//ui-header-container-column-row				
			var divHeaderContainerColumnRow = divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);

			//ui-header-cell
			var divHeaderCell = $(document.createElement('div'));
			divHeaderCell.addClass('ui-header-cell');
			divHeaderCell.attr('colindex', colIndex);
			divHeaderCell.attr('name', column.name);			
			divHeaderCell.css('text-align', column.align);
			divHeaderContainerColumnRow.append(divHeaderCell);

			//ui-header-cell-inner
			var spanHeaderCellInner = $(document.createElement('span'));
			spanHeaderCellInner.addClass('ui-header-cell-inner');
			divHeaderCell.append(spanHeaderCellInner);

			if (column.isCheckbox) {
				var inputCheck = $(document.createElement('input'));
				inputCheck.attr('type', 'checkbox');
				inputCheck.css({
					cursor: 'pointer',
				});
				divHeaderCell.css({
					'text-align': 'center'					
				});	
				spanHeaderCellInner.append(inputCheck);
				inputCheck.change(function(event) {
					var checkboxes = controller.fixedColsBodyContainer.find('.ui-cell-inner.checkbox').find('input[type=checkbox]')
					for (var index = 0 ; index < checkboxes.length ; index++) {
						checkboxes[index].checked = event.target.checked;
					}
				});

			} else {
				var content = column.header || column.name;
				spanHeaderCellInner.html(content);
			}


			//container param comes filled just when we creating sub columns (grouped column headers)
			if (angular.isDefined(headerContainerColumnRow)) {
				headerContainerColumnRow.append(divHeaderContainerColumn);
			} else {	

				//fixed column?
				if ((column.isFixedColumn) || (uiDeniGridUtilSrv.isFixedColumn(controller, column.name))) {
					controller.fixedColsHeaderContainer.append(divHeaderContainerColumn);
				} else {
					controller.headerContainer.append(divHeaderContainerColumn);
				}  
			}	

			//
			if (controller.columnHeaderLevels > 1) {
				//
				if  (column.columns) {
					//
					divHeaderContainerColumn.addClass('has-subcolumns');
					//
					divHeaderCell.addClass('has-subcolumns');
					//ui-header-container-column-row				
					divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);
					//
					me.createColumnHeaders(controller, column.columns, divHeaderContainerColumnRow, currentLevel+1, colIndex);
					//
					var lastColumnAdded = divHeaderContainerColumnRow.find('.ui-header-container-column.last-subcolumn');
					colIndex = lastColumnAdded.attr('colIndex');
				} else {
					if (currentLevel < controller.columnHeaderLevels) {
						//
						var heightDivHeaderContainerColumnRow = divHeaderContainerColumnRow.css('height');
						//
						var missingLevels = controller.columnHeaderLevels - currentLevel;
						//
						var calcNewHeight = 'calc(' + heightDivHeaderContainerColumnRow + ' + (' + controller.options.columnHeaderHeight + ' * ' + missingLevels + '))';
						//
						divHeaderContainerColumnRow.css({
							height: calcNewHeight,
						    //'background-size': '1px ' + calcNewHeight
						    //'background-size': '1px 100%'
						});    
					}
				}
			}

			colIndex++;	
		}

	}

	/**
	 *
	 *
	 */

	me.createColumnHeadersEvents = function(controller) {
		var hrVerticalLineResizing;
		//var columnHeaderCellResizing;
		var headerContainerColumnResizing;
		var canResize = false;

		var updResizing = function() {
			//controller.colsViewport.css('cursor', 'col-resize');
			//if ((columnHeaderCellResizing) && (event.which == 1)) {
				if (hrVerticalLineResizing == undefined) {
					hrVerticalLineResizing = document.createElement('hr');
					hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
					controller.colsViewport.append(hrVerticalLineResizing);
				}

				var leftResizing = event.pageX - controller.colsViewport.offset().left;
				//console.info(leftResizing);
				$(hrVerticalLineResizing).css({
					display: 'block',
					left: leftResizing,
					height: controller.colsViewport.height() + 'px'
				});
			//} else 	{
			//	$(hrVerticalLineResizing).css('display', 'none');
			//}
		}	

		var setResizing = function() {
			if (!hrVerticalLineResizing) { 
				hrVerticalLineResizing = document.createElement('hr');
				hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
				controller.colsViewport.append(hrVerticalLineResizing);
			}
			updResizing();			
		}

		var setResizingOff = function() {
			controller.resizing = false;
			//columnHeaderCellResizing = null;
			headerContainerColumnResizing = null;
			controller.colsViewport.css('cursor', 'default');
			if (hrVerticalLineResizing) { 
				$(hrVerticalLineResizing).css('display', 'none');
			}
		}

		//Mouse Down
		controller.headerContainer.mousedown(function(event) {
			headerContainerColumn = $(event.target).closest('.ui-header-container-column');
			if (headerContainerColumn.length > 0) {				
			//if (event.toElement.parentElement === controller.headerContainer.get(0)) {
				if (canResize) {
					controller.resizing = true;
				}	

			}	
			event.preventDefault();
			//event.stopImmediatePropagation(); //Prevent the mousedown that happening when we are resizing the columns
		});	

		//It is necessary when there are grouped columns
		var adjustParentColumnsWidths = function(headerContainerColumn, differenceNewWidth) {
			//
			var headerContainerColumnParent = headerContainerColumn.parents('.ui-header-container-column:eq(0)');
			if (headerContainerColumnParent.length > 0) {
				var children = headerContainerColumnParent.find('.ui-header-container-column');

				//couning border right width (1px)
				var borderWidths = children.length; 
				//
				headerContainerColumnParent.width(headerContainerColumnParent.width() + differenceNewWidth - borderWidths);
				//
				return adjustParentColumnsWidths(headerContainerColumnParent, differenceNewWidth);
			}
			return headerContainerColumn;
		}

		//It is necessary when there are grouped columns
		var adjustChildrenColumnsWidths = function(headerContainerColumn, newWidth) {
			//
			var children = headerContainerColumn.find('.ui-header-container-column');

			//
			if (children.length > 0) {
				//sum the widths
				var totalWidth = 0;
				for (var index = 0 ; index < children.length ; index++) {
					totalWidth += $(children[index]).width();
				}

				//get the column width percentage
				for (var index = 0 ; index < children.length ; index++) {
					var child = $(children[index]);
					var percentage = child.width() * 100 / totalWidth;

					child.css('width', (newWidth * percentage / 100) + 'px');
				}
			}	
		}


		//Mouse Up
		$(document).mouseup(function(event){	
			if (controller.resizing) {
				if (headerContainerColumnResizing) {
					//
					//var leftResizing = event.pageX - controller.colsViewport.offset().left;
					//var difference = event.clientX - headerContainerColumnResizing.getBoundingClientRect().right;
					var right = headerContainerColumnResizing.getBoundingClientRect().left + headerContainerColumnResizing.clientWidth;
					var difference = event.pageX - right;
					$headerContainerColumnResizing = $(headerContainerColumnResizing);
					var newWidth = $headerContainerColumnResizing.width() + difference;

					//It is necessary when there are grouped columns
					if ($headerContainerColumnResizing.is('.has-subcolumns')) {
						//
						var lastSubcolumn = $headerContainerColumnResizing.find('.ui-header-container-column.last-subcolumn');
						var lastSubcolumnWidth = lastSubcolumn.width();
						//
						$headerContainerColumnResizing.width(newWidth);

						//
						var borderWidth = 1;
						lastSubcolumn.width(lastSubcolumnWidth + difference + borderWidth);
						uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, lastSubcolumn, lastSubcolumn.attr('colindex'));
						//
						//adjustChildrenColumnsWidths($headerContainerColumnResizing, newWidth);						

						///////////////////////////////////////////////////////////////////////////////////////////
						// looking for children column headers - It is necessary when there are grouped columns
						///////////////////////////////////////////////////////////////////////////////////////////
						//	
						//
						//var headerContainerColumns = $headerContainerColumnResizing.find('.ui-header-container-column');
						//for (var index = 0 ; index < headerContainerColumns.length ; index++) {
						//	var headerContainerColumn = $(headerContainerColumns.get(index));
						//	uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, headerContainerColumn.attr('colindex'));													
						//}	
						///////////////////////////////////////////////////////////////////////////////////////////
						///////////////////////////////////////////////////////////////////////////////////////////
					} else {	
						
						//
						var lastAdjustedParent = adjustParentColumnsWidths($headerContainerColumnResizing, difference);
						//
						$headerContainerColumnResizing.width(newWidth);
						//
						uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, $headerContainerColumnResizing, $headerContainerColumnResizing.attr('colindex'));						
					}	

				}

				setResizingOff();
			}	
			controller.colsViewport.css('cursor', 'default');

			event.preventDefault();			
		});	


		// Returns a function, that, as long as it continues to be invoked, will not
		// be triggered. The function will be called after it stops being called for
		// N milliseconds. If `immediate` is passed, trigger the function on the
		// leading edge, instead of the trailing.
		var debounce = function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this;
				var args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};	

		//Mouse Move
		$(document).mousemove(function(event) {
			if (controller.options.enableColumnResize) {

				if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)
					if (controller.resizing) { 
						debounce(updResizing(), 100);
					}	
				} else if (event.which === 0) { //event.which: left: 1, middle: 2, right: 3 (pressed)
					controller.colsViewport.css('cursor', 'default');					

					headerContainerColumn = $(event.target).closest('.ui-header-container-column');
					if (headerContainerColumn.length > 0) {				

						var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
						canResize = false;
						//columnHeaderCellResizing = null;
						headerContainerColumnResizing = null;

						for (var index = 0 ; index < columnHeadersCell.length ; index++) {
							var columnHeaderCell = columnHeadersCell[index];

							var position = columnHeaderCell.getBoundingClientRect();
							if ((event.clientX > position.right - 5) && (event.clientX < position.right + 3)) {
								canResize = true;
								controller.colsViewport.css('cursor', 'col-resize');
								//columnHeaderCellResizing = columnHeaderCell;
								headerContainerColumnResizing = columnHeaderCell.closest('.ui-header-container-column');
								break;
							}
						}

						if (canResize) {
							//setResizing();
						} else {
							//setResizingOff();
						}
					}	
				}
			}	

			event.preventDefault();			
		});


		//////////////
		//////////////		
		//////////////
		var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
		for (var index = 0 ; index < columnHeadersCell.length ; index++) {
			var columnHeaderCell = $(columnHeadersCell[index]);

			//
			// Mouse Enter
			columnHeaderCell.mouseenter(function(event) {
				$(event.currentTarget).addClass('hover');
			});

			//
			// Mouse Leave
			columnHeaderCell.mouseleave(function(event) {
				$(event.currentTarget).removeClass('hover');
			});

			//
			// Mouse Up
			columnHeaderCell.mouseup(function(event) {
				if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)
					if (controller.colsViewport.css('cursor') == 'default') { //prevent conflict with the resizing columns function
						if (controller.options.sortableColumns) {
							var headerCell = $(event.currentTarget);
							var direction = 'ASC'; //default				
							if (headerCell.is('.asc')) {
								direction = 'DESC';
							}								

							var headerContainerColumn = $(event.target.closest('.ui-header-container-column'));

							if (!headerContainerColumn.is('.has-subcolumns')) {
								controller.options.api.sort({name: headerCell.attr('name'), direction: direction});
							}	
						}	
					}	
				}	
			});
		}	
		//////////////
		//////////////		

	}	


	/**
	 * TODO: It doesn't work when the data is grouped and its children are expanded... IMPROVE THAT!
     *
	 * @param sorters {Array|Object|String} direction is optional
	 * Example: 
	 * 		me.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
	 * 		me.sort({name: 'city', direction: 'ASC'}); or 
	 *		me.sort('city');
	 *		me.sort(function(rec1, rec2) {
	 *			if (rec1.age == rec2.age) return 0;
	 *			return rec1.age < rec2.age ? -1 : 1;
	 *		});	
	 *
	 */
	var _sort = function(controller, sorters) {
		var sortersArray;
		//Transform param to a Array
		if (angular.isString(sorters)) { //passed a string
			sortersArray = [{name: sorters, direction: 'ASC'}];
		} else if (angular.isObject(sorters)) {
			if (angular.isArray(sorters)) { //passed a array
				sortersArray = sorters;
			} else { //passed a json
				sortersArray = [sorters];
			}
		} else if (angular.isFunction(sorters)) { //Custom Sort
			sortersArray = [sorters];
		} else {	
			throw new Error('"sort": param "sorters" passed in a wrong way');
		}

		if (controller.options.data) {
			var sortFn = function(array) {
				for (var index = 0 ; index < array.length ; index++) {
					var sort = array[index];
					var direction = sort.direction || 'ASC'; //default value
					controller.options.data = $filter('orderBy')(controller.options.data, sort.name, direction.toUpperCase() == 'DESC');
				}
			}
			// Are there fixed sorters?
			if (controller.options.fixedSorters) {
				sortFn(controller.options.fixedSorters);
			}		

			sortFn(sortersArray);
		}	

		return sortersArray;
	}

	/**
	 * @param sorters {Array|Object|String} direction is optional
	 * Example: 
	 * 		me.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
	 * 		me.sort({name: 'city', direction: 'ASC'}); or 
	 *		me.sort('city');
	 *
	 */
	me.sort = function(controller, sorters, holdSelection) { 
		//var shouldHoldSelection = holdSelection == false ? false : true;
		var recordToHold;
		if (holdSelection != false) {
			recordToHold = me.getSelectedRow(controller);
		}	

		controller.headerContainer.find('div.ui-header-cell').removeClass('sort').removeClass('asc').removeClass('desc'); //remove all sorters icons

		var sortersArray;

		//GROUPING
		if (controller.options.api.isGrouped()) {
			sortersArray = _sort(controller, sorters);

			//
			controller.bodyContainer.find('.ui-row.collapse').filter(function() {
				var rowElementGroupExpanded = $(this);
				var groupIndex = parseInt(rowElementGroupExpanded.attr('groupIndex'));
				var rowIndex = parseInt(rowElementGroupExpanded.attr('rowindex'));
				var record = controller.options.data[rowIndex];

				uiDeniGridUtilSrv.groupCollapse(controller, rowElementGroupExpanded, record, rowIndex);
				uiDeniGridUtilSrv.groupExpand(controller, rowElementGroupExpanded, record, rowIndex);				
			});

		//ROW DETAIL	
		} else if (controller.options.rowDetails) {
			var recordsToExpand = [];
			//get the expanded lines
			var rowElementsExpanded = controller.bodyContainer.find('.ui-row.row-detail-expanded').filter(function() {
				var rowIndex = parseInt($(this).attr('rowindex'));
				var record = controller.options.data[rowIndex];				
				recordsToExpand.push(record);
			});

			//
			sortersArray = _sort(controller, sorters);

			//
			controller.options.api.loadData(controller.options.data);

			for (var index = 0 ; index < recordsToExpand.length ; index++) {
				var record = recordsToExpand[index];
				var rowIndex = controller.options.api.resolveRowIndex(record);
				var rowElement = controller.options.api.resolveRowElement(rowIndex);

				uiDeniGridUtilSrv.rowDetailsExpand(controller, rowElement, record, rowIndex);
			}
			controller.options.api.repaint();

		//COMMON ROW	
		} else {	
			sortersArray = _sort(controller, sorters);

			//
			controller.options.api.loadData(controller.options.data);
		}	


		for (var index = 0 ; index < sortersArray.length ; index++) {
			var sort = sortersArray[index];

			if (!angular.isFunction(sort)) {
				var $headerColElement = $(_getHeaderColElementByName(controller, sort.name, true));
				$headerColElement.addClass('sort');
				$headerColElement.addClass(sort.direction ? sort.direction.toLowerCase() : 'asc');			
			}	
		}

		//Call ui-deni-view method sort
		//controller.options.api.sort(sortersArray);

		if (recordToHold) {
			me.selectRow(controller, recordToHold);
		}


		return sortersArray;
	}

	/**
	 * @param raiseError {boolean} Raise a error when it is not found
	 *
	 */
	var _getHeaderColElementByName = function(controller, columnName, raiseError) {
		var columns = controller.headerContainer.find('div.ui-header-cell[name="' + columnName + '"]');
		if (columns.length == 0) {
			if (raiseError) {
				throw new Error('There is not a columns with a name "' + columnName + '"!');
			} else {
				return null;
			}
		} else {
			return columns[0];
		}
	}

	//
	//
	var _rendererRealcedCells = function(colName, value, searchInfo) {
		var keys = Object.keys(searchInfo.valuesToFind);
		if (keys.indexOf(colName) == -1) {
			return value;
		} else {
			var valueToFind = searchInfo.valuesToFind[colName];
			var pos = value.indexOf(valueToFind);
			if (pos == -1) {
				return value;
			} else {
				var realce = searchInfo.opts.inLine.realce;
				var newValue = ''; 
				var initPos = pos;
				while (pos != -1) {
					newValue += value.substring(value, pos);
					var valueToTemplate = value.substring(pos, pos + valueToFind.length);
					var parsedValue = '<span style="' + realce.style + '">' + valueToTemplate + '</span>';
					newValue += parsedValue;

					initPos = pos + parsedValue.length;
					pos = value.indexOf(valueToFind, initPos);
				}
				return newValue;			
			}		
		}
	}

	//
	//
	//
	var _createDivCell = function(controller, rowElement) {

		//
		var divCell = $(document.createElement('div'));
		divCell.addClass('ui-cell');

		if (!rowElement.is('.row-detail')) {
			///////////////////////////////////''
			//Set the events here 
			///////////////////////////////////					
			//mouseenter
	    	divCell.mouseenter(function(event) {

	    		//selType = 'row'	
	    		if (controller.options.selType == 'row') {
	        		//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
					//
				 	controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('hover'); 
				 	//
				 	controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('hover'); 

	        	//selType = 'cell'		
	        	} else {
	        		$(event.currentTarget).addClass('hover');
	        	}	

	    	});

			//mouseleave
	    	divCell.mouseleave(function(event) {
	    		//$(event.currentTarget).parent().find('.ui-cell').removeClass('hover');
				//
			 	controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover'); 
			 	//
			 	controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover'); 

	    	});

	    	//mousedown
	    	divCell.mousedown(function(event) {
	    		if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)

	    			//selType = 'row'	
	    			if (controller.options.selType == 'row') {
	    				var divCell = $(event.currentTarget);
						var rowElement = divCell.closest('.ui-row');
						var rowIndex = parseInt(rowElement.attr('rowindex'));

						me.selectRow(controller, rowElement);

					//selType = 'cell'	
					} else {
						//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
						var divCell = $(event.currentTarget);
						var colIndex = parseInt(divCell.attr('colIndex'));
						var rowElement = divCell.closest('.ui-row');
						var rowIndex = parseInt(rowElement.attr('rowindex'));

						//var rowElement = $(event.currentTarget).closest('.ui-row');
						//var divCell = rowElement.closest('.ui-cell');

						me.selectCell(controller, rowElement, colIndex);
					}	

				}	
	    	});

			//doubleclick
	    	divCell.dblclick(function(event) {
	    		var divCell = $(event.currentTarget);
	    		var colIndex = parseInt(divCell.attr('colIndex'));
				var column = controller.options.columns[colIndex]

				if (column.editor) {
					var rowElement = divCell.closest('.ui-row');
					var rowIndex = parseInt(rowElement.attr('rowindex'));
					var record = controller.options.data[rowIndex];
					uiDeniGridUtilSrv.setInputEditorDivCell(controller, record, column, divCell);
				}	
	    	});

			///////////////////////////////////
			///////////////////////////////////
		}
			
		rowElement.append(divCell);

		return divCell;
	}

	//
	//
	//
	var _createDivCellInner = function(divCellParent) {
		var spanCellInner = $(document.createElement('span'));
		spanCellInner.addClass('ui-cell-inner');

		divCellParent.append(spanCellInner);

		return spanCellInner;
	}


	/**
	 *	
	 *
	*/		 
	me.createUiDeniViewEvents = function(controller) {

		//
		//
		controller.options.listeners.onrenderer = function(rowElement, fixedRowElement, record, rowIndex, viewController) {


			//Row Detail - Grouping or other type of row details
			if (rowElement.is('.row-detail')) {
				//uiDeniGridUtilSrv.renderCommonRow(controller, rowElement, record, rowIndex);

				//
				var divCell = _createDivCell(controller, rowElement);
				divCell.addClass('row-detail');

				//
				var spanCellInner = _createDivCellInner(divCell);
				spanCellInner.addClass('row-detail');
				spanCellInner.addClass('expand');
				spanCellInner.css('cursor', 'pointer');

				spanCellInner.click(function(event) {
				 	//if (event.offsetX <= 12) { //:before pseudo element width
				 		spanCellInner.toggleClass('expand collapse');
				 		rowElement.toggleClass('expand collapse');

				 		if (spanCellInner.is('.collapse')) {
				 			uiDeniGridUtilSrv.groupExpand(controller, rowElement, record, rowIndex);
				 		} else {
				 			uiDeniGridUtilSrv.groupCollapse(controller, rowElement, record, rowIndex);
				 		}
				 	//}
				});

				var valueToRender;
				if (controller.options.grouping.template) {
					var totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
					valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.grouping.template, record, {count: totalRowsInGroup});
				}	

				spanCellInner.html(valueToRender);

			// Grouping Footer	
			} else if (rowElement.is('.ui-grouping-footer-container')) {
				var columns = controller.options.columns;
				var totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
				var records = controller.options.data.slice(rowIndex, rowIndex + totalRowsInGroup);

				//
				uiDeniGridUtilSrv.createColumnFooters(controller, rowElement, columns, false);
				//
				uiDeniGridUtilSrv.renderColumnFooters(controller, rowElement, columns, records, false);

			// Row Template
			} else if (controller.options.rowTemplate) {
				//
				var divCell = _createDivCell(controller, rowElement);
				rowElement.css('width', '100%');
				divCell.css('width', '100%');
				valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.rowTemplate, record);
				divCell.html(valueToRender);

			// (Common Row)
			} else {
				//rowElement.css('width', '100%');

				var isRowSelected = rowElement.is('.selected');
				var columns = me.getColumns(controller, controller.options.columns);
				var colIndex = 0;
				for (var index = 0 ; index < columns.length ; index++) {

					//
					if (index == 0) {
						//if Fixed Columns
						if (controller.options.fixedCols) {

							//if has checkbox
							if (controller.options.fixedCols.checkbox) {
								var divCellIndicator = _createDivCell(controller, fixedRowElement);
								divCellIndicator.css('width', uiDeniGridConstants.FIXED_COL_CHECKBOX_WIDTH);
								divCellIndicator.addClass('auxiliar-fixed-column');
								var spanCellIndicatorInner = _createDivCellInner(divCellIndicator);
								spanCellIndicatorInner.addClass('checkbox');
								var inputCheck = $(document.createElement('input'));
								inputCheck.attr('type', 'checkbox');
								inputCheck.css({
									cursor: 'pointer'
								});
								spanCellIndicatorInner.append(inputCheck);
								colIndex++;
							}	

							//if has indicator
							if (controller.options.fixedCols.indicator) {
								var divCellIndicator = _createDivCell(controller, fixedRowElement);
								divCellIndicator.css('width', uiDeniGridConstants.FIXED_COL_INDICATOR_WIDTH);							
								divCellIndicator.addClass('auxiliar-fixed-column');
								var spanCellIndicatorInner = _createDivCellInner(divCellIndicator);
								spanCellIndicatorInner.addClass('indicator');
								colIndex++;
							}	

							//if has row number
							if (controller.options.fixedCols.rowNumber) {
								var divCellRowNumber = _createDivCell(controller, fixedRowElement);
								divCellRowNumber.css('width', uiDeniGridConstants.FIXED_COL_ROWNUMBER_WIDTH);
								divCellRowNumber.addClass('auxiliar-fixed-column');
								var spanCellRowNumberInner = _createDivCellInner(divCellRowNumber);
								spanCellRowNumberInner.addClass('rownumber');
								spanCellRowNumberInner.html(rowIndex + 1);
								colIndex++;
							}	
						}
					}

					//
					var column = columns[index];


					//
					var divCell;

					//if fixed column?
					if (uiDeniGridUtilSrv.isFixedColumn(controller, column.name)) {
						divCell = _createDivCell(controller, fixedRowElement);
					} else {
						divCell = _createDivCell(controller, rowElement);
					}	

					//
					var spanCellInner = _createDivCellInner(divCell);

					//
					if (index == 0) {
						//
						//rowDetails Property
						if (controller.options.rowDetails) {
							spanCellInner.addClass('row-detail');

							if (controller.options.rowDetails.autoExpand === true) {
								spanCellInner.addClass('collapse');
							} else {
								spanCellInner.addClass('expand');
							}	

							spanCellInner.click(function(event) {
							 	if (event.offsetX <= 12) { //:before pseudo element width
							 		var target = $(event.target);

							 		if (target.is('.collapse')) {
							 			uiDeniGridUtilSrv.rowDetailsCollapse(controller, rowElement, record, rowIndex);							 			
							 		} else {
							 			uiDeniGridUtilSrv.rowDetailsExpand(controller, rowElement, record, rowIndex);
							 		}
							 	}
							});

						}
					}

					//
					var style = column.style || {};
					divCell.css(angular.extend(style, {
						'text-align': column.align || 'left'
					}));
					

					//Margin First column inside of grouping
					if ((index == 0) && (controller.options.api.isGrouped())) {
						divCell.css('padding-left', '20px');					
					}	

					var value = eval('record.' + column.name); //Can be passed "adderess.cicy", for example;
					//var value = record[column.name];

					//Is there a specific render for this field?
					if (column.renderer) {
						value = column.renderer(value, record, columns, rowIndex);
					}

					var formattedValue = value;
					if (angular.isDefined(column.format)) {
						formattedValue = uiDeniGridUtilSrv.getFormatedValue(value, column.format);
					}

					//Is there something to realce (Used in Searches and Filters)
					if ((isRowSelected) && (controller.searchInfo)) {
						formattedValue = _rendererRealcedCells(column.name, formattedValue, controller.searchInfo);
					}

					//
					spanCellInner.html(formattedValue);

					//
					//divCell.append(spanCellInner);
					//
					divCell.attr('colIndex', colIndex);
					colIndex++;
				}

			}	
		}	

		//
		//
		controller.options.listeners.onbeforeload = function(data, options) {
			//Are there footer?
			if (uiDeniGridUtilSrv.hasColumnFooter(controller)) {
				//
				uiDeniGridUtilSrv.renderColumnFooters(controller, controller.footerContainer, controller.options.columns, data, true);
				//
				uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(controller);
			}
		}

		//
		//
		controller.options.listeners.onafterload = function(data, options) {
			//
			uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(controller);
		}

		//
		//
		controller.options.listeners.onafterexpand = function(records, options, elementGroupRow, lastInsertedDivRow) {
			if (records.length > 0) {
				var rowIndex = controller.options.api.resolveRowIndex(records[0]);
				me.selectRow(controller, rowIndex);
			}	

			//Are there footer?
			if (uiDeniGridUtilSrv.hasColumnFooter(controller)) {

				var footerDivContainer = elementGroupRow.prop('footer');
				if (angular.isDefined(footerDivContainer)) {
					footerDivContainer.css('display', 'block');
				} else {
					//Create a div container to insert the footer of the grouping
					var footerDivContainer = $(document.createElement('div'));
					footerDivContainer.addClass('ui-deni-grid-grouping-footer-container');

					//Used to collapse
					elementGroupRow.prop('footer', footerDivContainer);

					footerDivContainer.insertAfter(lastInsertedDivRow);

					uiDeniGridUtilSrv.renderColumnFooters(footerDivContainer, controller.footerContainer, controller.options.columns, records, controller);
				}	
			}
		}

		//
		//
		controller.options.listeners.onafterrepaint = function(viewController) {

			//
			if (!controller.options.hideHeaders) {
				var colIndex = 0;

				//Fixed Columns
				var headerContainerColumns = controller.fixedColsHeaderContainer.find('.ui-header-container-column:not(.has-subcolumns)');
				for (var index = 0 ; index < headerContainerColumns.length ; index++) {
					var headerContainerColumn = $(headerContainerColumns[index]);
					uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
					colIndex++;
				}

				//Variable Columns
				var headerContainerColumns = controller.headerContainer.find('.ui-header-container-column:not(.has-subcolumns)');
				for (var index = 0 ; index < headerContainerColumns.length ; index++) {
					var headerContainerColumn = $(headerContainerColumns[index]);
					uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
					colIndex++;
				}
			}	

        }

        //
        controller.bodyViewport.scroll(function(event) {
		    var currentLeft = $(this).scrollLeft();

		    //Vertical Scroll
		    if(controller.bodyViewport.currentScrollLeft === currentLeft) {
		    	controller.bodyViewport.currentScrollTop = $(this).scrollTop();

		        var firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	var boundingClientTop = firstViewRow.get(0).getBoundingClientRect().top;

		        	//
		        	var top = (controller.bodyViewport.currentScrollTop * -1) + 'px';

		        	//	
					if (controller.options.fixedCols) {		        	
		        		controller.fixedColsBodyContainer.css('top', top);
		        	}	
		        	//
					//controller.footerDivContainer.find('.ui-deni-grid-footer').css('top', top);
					//controller.footerDivContainer.css('left', left);
		        }

		    } 
		    //Horizontal Scroll		    
		    else {
		    	controller.bodyViewport.currentScrollLeft = currentLeft;

		        var firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	var boundingClientLeft = firstViewRow.get(0).getBoundingClientRect().left;

		        	//
		        	var left = (controller.bodyViewport.currentScrollLeft * -1) + 'px';

		        	//	
		        	controller.headerContainer.css('left', left);
		        	//
					controller.footerDivContainer.find('.ui-deni-grid-footer').css('left', left);
					//controller.footerDivContainer.css('left', left);
		        }
		    }

			controller.options.api.repaint();		    

        });

	}

	/**
	 *
	 */
	me.getSelectedRow = function(controller) {
		if (controller.rowIndex === undefined) {
			return null;
		} else {
			return controller.options.data[controller.rowIndex];
		}
	}    

	/**
	 *
	 */
	me.getChangedRecords = function(controller) {
		var changedRows = controller.bodyViewport.find('div.ui-row.changed');
		var data = controller.options.data;
		var changedRecords = [];
		for (var index = 0 ; index < changedRows.length ; index++) {
			var rowIndex = $(changedRows[index]).attr('rowindex');
			var changedRecord = data[rowIndex];
			changedRecords.push(changedRecord);
		}
		return changedRecords;
	}    

	//
	//
	//
	//
	//
	//
	var _resolveJavaScriptElement = function(element) {				
		// If element is already a jQuery object
		if(angular.isElement(element)) {
		    return element.get(0);
		} else {
			return element;
		}
	}

	//
	//
	//
	//
	//
	//
	var _resolveJQueryElement = function(element) {				
		// If element is already a jQuery object
		if(angular.isElement(element)) {
		    return element
		} else {
			return $(element);
		}
	}

	// This function help some other functions which get row parameter where sometimes
	// it comes like a record object and sometimes comes its recordIndex
	//
	// record {Object|Number} Can be passed rowIndex or the object record
	// returns the row
	var _resolveRecord = function(controller, record) {
		if (angular.isObject(record)) {  //passed the object record
			return record;
		} else { //passed rowIndex
			return controller.options.data[record];
		}
	}

	/**
	 *	row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
	 *
	 */		 
	me.isRowSelected = function(controller, row) {
		var rowElement = controller.options.api.resolveRowElement(row);
		return rowElement.is('.selected');
	}	

	/**
	 *
	 *
	 */		 
	me.getSelectedRowIndex = function(controller) {
		var selectedRows = controller.bodyViewport.find('div.ui-row.selected');

		//not found, return -1
		if (selectedRows.length == 0) return -1; 

		//return just one index
		if (selectedRows.length == 1) {
			return parseInt($(selectedRows[0]).attr('rowindex'));
		}
		//return a array of index (multi select)
		if (selectedRows.length > 1) {
			var indexArray = [];
			for (var index = 0 ; index < selectedRows.length ; index++) {
				indexArray.push(parseInt($(selectedRows[index]).attr('rowindex')));
			}
			return indexArray; 
		}	
	}	

	/**
	 *	row {Object|Number} Can be passed rowIndex or the object record
	 *  preventSelectionChange {Boolean} default false
	 *  scrollIntoView {Boolean} default true
	*/		 
    me.selectRow = function(controller, row, preventSelectionChange, scrollIntoView) {
    	if ((controller.options.data) && (controller.options.data.length > 0)) {

    		//
    		var rowElement;

    		//
    		if (angular.isElement(row)) {
	    		//	
	    		rowElement = row;
	    		//
				controller.rowIndex	= parseInt(rowElement.attr('rowindex'));
	    	} else {	
	    		//
	    		var rowIndex;

	    		//
	    		if (controller.options.api.isGrouped()) {
	    			//
	    			rowIndex = controller.options.api.resolveRowIndex(row);	
	    		//	
	    		} else {
	    			rowIndex = controller.options.api.resolveRowIndex(row);    			
	    		}

		    	//
		    	//var rowElement = controller.options.api.resolveRowElement(row);	    	

	    		//
	    		scrollIntoView = (scrollIntoView == false ? false : true);

				//
				if (rowIndex == -1) {
					throw new Error("selectRow: row passed in a wrong way!");
				}

				/*
		    	//
				var scrollIntoViewFn = function(rowElementToScroll) {
					if (scrollIntoView) {
						if (!controller.options.api.isRowVisible(rowElementToScroll)) {
							rowElementToScroll.get(0).scrollIntoView(false);
						}	
					}
				};
				*/

				//if (rowIndex == controller.rowIndex) {
				if (me.isRowSelected(controller, rowIndex)) {
					//
					scrollIntoViewFn(rowIndex);
				} else {	
					controller.rowIndex = rowIndex;

					if (controller.options.api.isGrouped()) {
						var itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
						if (!itemRow) {
							var groupIndex = controller.options.data[rowIndex].groupIndex;						
							var groupInfo = controller.managerRendererItems.getInfoGroup(groupIndex);
							controller.colsViewport.scrollTop(groupInfo.top);
							controller.options.api.repaint();
							var record = controller.options.data[rowIndex];
							uiDeniGridUtilSrv.groupExpand(controller, groupInfo.rowElement, record, rowIndex)
							itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
						} 

						controller.colsViewport.scrollTop(itemRow.top);
						controller.options.api.repaint();

						rowElement = itemRow.rowElement;
					} else {
		    			var rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));
		    			var scrollTop = (rowIndex * rowHeight) - 10;
		    			controller.bodyViewport.scrollTop(scrollTop);
		    			controller.options.api.repaint();
		    			var itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
		    			rowElement = itemRow.rowElement;
					}	
				}	
			}	

			//
			if ((controller.rowIndex !== undefined) && (!controller.options.multiSelect)) {
				//remove all selections
				controller.options.api.clearSelections();
			}

			//
		 	controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('selected'); 
		 	//
		 	controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('selected'); 

		 	//
			if (controller.options.fixedCols) {			
				var fixedRow = controller.fixedColsBodyContainer.find('.ui-fixed-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)');
				fixedRow.addClass('selected');
				fixedRow.find('.ui-cell.indicator').addClass('selected');
			}	
			if (controller.options.rowDetails) {
				rowElement.parent().find('.ui-row.row-detail-container[rowIndex=' + rowElement.attr('rowindex') + ']').addClass('selected');
			}	

			//
			//scrollIntoViewFn(rowElement);

			////////////////////////////////////////////////////
			//onselectionchange event
			////////////////////////////////////////////////////			
			if (!preventSelectionChange) {
				if (controller.options.listeners.onselectionchange) {
					controller.options.listeners.onselectionchange(controller, controller.element, controller.rowIndex, controller.options.data[controller.rowIndex]);
				}
			}	
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			

		} else {
			throw new Error('"selectRow": There is not record to select!');
		}	
    }

	/**
	 *	row {Object|Number} Can be passed rowIndex or the object record
	 *  preventSelectionChange {Boolean} default false
	 *  scrollIntoView {Boolean} default true
	 *  colIndex {Integer} Column Index.
	*/		 
    me.selectCell = function(controller, row, colIndex, preventSelectionChange, scrollIntoView) {    
    	if ((controller.options.data) && (controller.options.data.length > 0)) {

    		//
    		scrollIntoView = (scrollIntoView == false ? false : true);

    		//
    		var rowElement = controller.options.api.resolveRowElement(row);
			//
			if (row.length == 0) {
				throw new Error("selectCell: row passed in a wrong way!");
			}

    		var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
			//
			if (divCell.length == 0) {
				throw new Error("selectCell: colIndex passed in a wrong way!");
			}

			if (!controller.options.multiSelect) {
				//remove all selections
				controller.options.api.clearSelections();
			}
			
			divCell.addClass('selected');

    		//
    		var rowIndex = controller.options.api.resolveRowIndex(row);
			controller.rowIndex = rowIndex;
			controller.colIndex = colIndex;			
		}
    }	


	/**
	 *	Usage:  getColumns(controller, controller.options.columns)
	 *
	*/		 
    me.getColumns = function(controller, sourceColumns) {

    	var columns = [];
		for (var index = 0 ; index < sourceColumns.length ; index++) {
			var column = sourceColumns[index];

			//
			if (column.columns) {
				columns = columns.concat(me.getColumns(controller, column.columns));
			} else {
				columns.push(column);
			}
		}

		return columns;
    },


	/**
	 *	
	 *
	*/		 
    me.getColumn = function(controller, fieldName) {
		for (var index = 0 ; index < controller.options.columns.length ; index++) {
			if (controller.options.columns[index].name == fieldName) {
				return controller.options.columns[index];
			}
		}

		return null;
    },


	/**
	 *	
	 *
	*/		 
	me.updateSelectedRow = function(controller, json) {

		if (controller.rowIndex === undefined) {
			throw "You have to select a record";
		} else {
			//
			var fieldsNotNested = uiDeniGridUtilSrv.prepareForNestedJson(json);
			//
			var keyFieldsToChange = Object.keys(fieldsNotNested);

			//
			for (var index = 0 ; index < keyFieldsToChange.length ; index++) {
				var fieldNameToChange = keyFieldsToChange[index];
				
				//Try to discover the col index
				var column = controller.options.api.getColumn(fieldNameToChange);

				if (column) {
					//
					var colIndex = controller.options.columns.indexOf(column);
					//
					var newValue = eval('json.' + fieldNameToChange);
					//
					me.updateCell(controller, controller.rowIndex, colIndex, newValue);					
				} else {
					console.warn('"updateSelectedRow" : field "' + fieldNameToChange + '" not found!');					
				}
			}
		}
	}

	/**
	 *	@param colIndex {Integer} this param is passed when we want to update a cell which is not selected
	 *
	*/		 
	me.updateSelectedCell = function(controller, value) {

		if ((!angular.isDefined(controller.rowIndex)) || (!angular.isDefined(controller.colIndex))) {
			throw "You have to select a record";
		} else {
			me.updateCell(controller, controller.rowIndex, controller.colIndex, value);
		}

	}	

	/**
	 *	
	 *
	*/		 
	me.updateCell = function(controller, rowIndex, colIndex, value) {
		var rowElement = controller.options.api.resolveRowElement(rowIndex);
		var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
		var spanCellInner = divCell.find('.ui-cell-inner');
		spanCellInner.html(value);

		//
		divCell.addClass('changed');
		//When we need the changed records we can get by ".ui-row.changed"
		divCell.closest('.ui-row').addClass('changed'); 
	}	

	/**
	 *	
	 *
	*/		 
	me.isHideHeaders = function(controller) {
		return controller.options.hideHeaders;
    }

	/**
	 *	
	 *
	*/		 
	me.setHideHeaders = function(controller, hideHeaders) {
		var display;
		if (hideHeaders) {
			display = 'none';
		} else {
			display = 'block';
		}
		controller.colsViewport.find('.ui-header-viewport').css('display', display);
		controller.options.hideHeaders = hideHeaders;
	}

	/**
	 *	
	 *
	 */
	me.load = function(controller) {
		var deferred = $q.defer();
		if (controller.options.url) {
			$http.get(controller.options.url)
				.then(function(response) {
					controller.options.api.loadData(response.data);
					deferred.resolve(response.data);
				}, 
				function(response) {
					deferred.reject(response.statusText);
    			});
		} else {
			deferred.reject('"load" : To use load function is necessary set the url property.');			
		}

		return deferred.promise;
	}	

	/**
	 *	
	 *
	 */
	me.loadData = function(controller, data) {
		//TODO: CLEAR THIS AFTER (Just for test)
		var start = new Date();

		///////////////////////////////////////////////////////////////////////////
		//BeforeLoad Event
		///////////////////////////////////////////////////////////////////////////		
		if (controller.options.listeners.onbeforeload) {
			controller.options.listeners.onbeforeload(data, controller.options);
		}
		//////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////		

		//
		controller.renderedIndexes = [];

		//Load the data
		controller.options.data = data; 

		//Records inside Grouping
		controller.groupRecords = [];		
		//Data Grouping itself
		controller.options.dataGroup = [];

		//Remmove all rows before load
		controller.bodyContainer.find('.ui-row').remove();
		controller.fixedColsBodyContainer.find('.ui-row').remove();


		//
		var rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));

		//
		controller.rowsPerPage = parseInt(controller.bodyViewport.height() / rowHeight) + 1;
		var limitLength = (data.length < controller.rowsPerPage ? data.length : controller.rowsPerPage);

		//
		//
		// GROUPING
		if (controller.options.api.isGrouped()) {
			var expressionToGroup = controller.options.grouping.expr;

			var getEvalFieldValue = function(record, fieldName) {
				return eval('record.' + fieldName);			  
			}

			var getEvalExpressionValue = function(record, expression) {
				var evalStr = '(function() {\n' +
			    			  '		with (record) {\n' +
							  '				return ' + expression + '\n' +
							  '		}\n' +
							  '})()';

				return eval(evalStr);			  
			}

			var fieldsNotNested = uiDeniGridUtilSrv.prepareForNestedJson(controller.options.data[0]);
			var fields = Object.keys(fieldsNotNested);

			var functionToEvaluate;
			//When the expression is simply a field, use the simple evaluate (works most quickly)
			if (fields.indexOf(controller.options.grouping.expr)) {
				functionToEvaluate = getEvalFieldValue;	
			} else {
				functionToEvaluate = getEvalExpressionValue;				
			}

			//
			//
			/*
			var sortGroupingFn = function(rec1, rec2) {
				var val1 = functionToEvaluate(rec1, expressionToGroup);
				var val2 = functionToEvaluate(rec2, expressionToGroup);

				if (val1 == val2) {
					return 0;
				} else {
					return val1 > val2 ? -1 : 1
				}
			};	
			*/

			//controller.options.api.sort(sortGroupingFn);
			controller.options.data = $filter('orderBy')(controller.options.data, expressionToGroup);			

			//Add a fixed sorter to a group
			controller.options.fixedSorters	= [{
				name: expressionToGroup, 
				direction: 'ASC'		
			}];

			//
			var oldValue;
			var recordGroup;
			var groupIndex = -1;
			for (var index = 0 ; index < controller.options.data.length ; index++) {
				var record = controller.options.data[index];	
				var value = functionToEvaluate(record, expressionToGroup);			

				//
				if (oldValue == value) {
					//
					recordGroup.children++;

				//changed value	
				} else { 
					oldValue = value;					
					groupIndex++;					
					recordGroup = record;					
					recordGroup.children = 1;

					controller.options.dataGroup.push(record);
				}

				record.groupIndex = groupIndex;
				record.rowIndex = index;

			}

			//
			controller.bodyContainer.height((controller.options.dataGroup.length * rowHeight) + 2);
			if (controller.options.fixedCols) {
			  controller.fixedColsBodyContainer.height(controller.bodyContainer.height());	
			}  
		} else {
			//
			controller.bodyContainer.height((controller.options.data.length * rowHeight) + 2);		
			if (controller.options.fixedCols) {
			  controller.fixedColsBodyContainer.height(controller.bodyContainer.height());	
			}  
		}

		//
		controller.managerRendererItems.createItems();


		//
		me.repaint(controller);


		//TODO: CLEAR THIS AFTER (Just for test)
		var end = new Date();
		var seconds = (end - start) / 1000;
		$('.divResponse').html(data.length + ' records, ' + seconds + ' seconds.');
		////////////////////////////////////////////////////////////////////////////


		///////////////////////////////////////////////////////////////////////////
		//AfterLoad Event
		///////////////////////////////////////////////////////////////////////////		
		if (controller.options.listeners.onafterload) {
			controller.options.listeners.onafterload(data, controller.options);
		}
		///////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////		

	};

	/**
	 * 
	 *
	 * 
	 * 
	 */
	 /*
	me.groupCollapse = function(controller, elementGroupRow) {
		var indexStart = parseInt(elementGroupRow.attr('indexStart'));
		var indexEnd = parseInt(elementGroupRow.attr('indexEnd'));		

		//Add divs which will have data
		for (var index = indexStart ; index <= indexEnd ; index++) {
			var divRow = controller.bodyViewport.find('div.ui-row[rowIndex=' + index + ']');
			if (divRow.length > 0) {
				divRow.css('display', 'none');				
			}
		}

		var footer = elementGroupRow.prop('footer');
		if (angular.isDefined(footer)) {
			footer.css('display', 'none');
		}

		me.repaint(controller);
	}	
	*/

	/**
	 * 
	 *
	 * 
	 * 
	 */
	 /*
	me.groupExpand = function(controller, elementGroupRow) {
		var indexStart = parseInt(elementGroupRow.attr('indexStart'));
		var indexEnd = parseInt(elementGroupRow.attr('indexEnd'));		
		var lastInsertedDivRow;

		var groupRecords = controller.options.data.slice(indexStart, indexEnd + 1);
		var groupIndex = parseInt(elementGroupRow.attr('groupindex'));

		var divRow = controller.bodyViewport.find('div.ui-row[groupindex=' + groupIndex + ']');
		if (divRow.length == 0) {
			//Add divs which will have data
			//for (var index = indexStart ; index <= indexEnd ; index++) {
			for (var rowIndex = 0 ; rowIndex < groupRecords.length ; rowIndex++) {			
				divRow = $(document.createElement('div'));
				divRow.attr('groupindex', groupIndex);				
				divRow.attr('groupRowIndex', rowIndex);				
				divRow.attr('rowindex', indexStart + rowIndex);
				divRow.css('height', controller.options.rowHeight);			
				//divRow.css('padding-left', '25px');				
				divRow.addClass('ui-row');

				if (controller.options.stripRows) {
					if (rowIndex % 2 == 1) {
						divRow.addClass('odd-line');
					}
				}	

				if (lastInsertedDivRow) {
					divRow.insertAfter(lastInsertedDivRow); 
				} else {
					divRow.insertAfter(elementGroupRow);
				}	
				lastInsertedDivRow = divRow;
			}	

			//
			elementGroupRow.attr('displayRows', divRow.css('display'));
			divRow.addClass('last-group-row');			
		} else {
			divRow.css('display', elementGroupRow.attr('displayRows')); //restore the display css property saved before.			
		}

		me.repaint(controller);

		//////////////////////////////////////////////////////////////////
		//OnAfterExpand Event
		//////////////////////////////////////////////////////////////////		
		if (controller.options.listeners.onafterexpand) {
			//var records = controller.options.data.splice(indexStart, indexEnd);
			controller.options.listeners.onafterexpand(groupRecords, controller.options, elementGroupRow, lastInsertedDivRow);
		}
		//////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////		
	}
	*/

	/**
	 * 
	 *
	 * @param valuesToFind {object} json which will contains the keys and values for the search
	 * @param opts TODO: specify in more details
	 * 
	 * return {array|record} depends on the value of "all" parameter.
	 */
	 me.find = function(controller, valuesToFind, opts) {
	 	var data = controller.options.data || [];
	 	valuesToFind = valuesToFind || {};
	 	var keys = Object.keys(valuesToFind);
	 	if (data.length == 0) {
			throw new Error ('"Find" : There is no data to find!');	 		
	 	} else if (keys.length == 0) {
			throw new Error ('"Find" : param "valuesToFind" must be informed!');
	 	}

	 	////////////////////////////////////////////////////////////////////////////////
	 	//get the opt parameter and fill the detault values too
	 	////////////////////////////////////////////////////////////////////////////////
	 	opts = opts || {};
	 	var exactSearch = (opts.exactSearch == false ? false : true); //Exact search? default = true (only used for string values)
	 	var all = (opts.all == true ? true : false); //Return all records found? default = false (In this case the search stop when the first record is found)
	 	var ignoreCase = (opts.ignoreCase == true ? true : false) //Ignore case when comparing strings (only used for string values)
	 	////////////////////////////////////////////////////////////////////////////////

	 	var recordsFound = (all ? [] : null); //the type of return depends on the value of "all" parameter
	 	var breakParentLoop = false;

	 	var newJson = uiDeniGridUtilSrv.prepareForNestedJson(valuesToFind);
	 	keys = Object.keys(newJson);
	 	////////////////////////////////////////////////////////////////////////////////
	 	////////////////////////////////////////////////////////////////////////////////
	 	var found = false;

	 	//loop over the data
	 	for (var index = 0 ; index < data.length ; index++) {
	 		var record = data[index];

		 	var foundRecord = false;

	 		//loop over the fields
		 	for (var fieldIndex = 0 ; fieldIndex < keys.length ; fieldIndex++) {
		 		var fieldName = keys[fieldIndex];

		 		var valueToFind = valuesToFind[fieldName];
		 		var value = eval('record.' + fieldName); //can be passed address.city
		 		var valueIsString = angular.isString(value);
		 		if (ignoreCase) {
		 			if (valueIsString) {
				 		valueToFind = valueToFind.toLowerCase();
				 		value = value.toLowerCase();
		 			}	
		 		}

				if ((exactSearch) || (!valueIsString)) {
					foundRecord = valueToFind == value;
				} else {
					foundRecord = value.indexOf(valueToFind) != -1;
				}	

				if (!foundRecord) {
					continue;
				}
		 	}

	 		if (foundRecord) { //found record?
	 			found = true;

				if (all) {
					recordsFound.push(record);
				} else {	
					return record;
				}
	 		}

	 	}

		/////////////////////////////////////////////////////////////////////////
		// "inLine" property
		/////////////////////////////////////////////////////////////////////////
		if (found && opts.inLine) {
			/////////////////////////////////////////////////////////////////////////
			// prepare the default values
			/////////////////////////////////////////////////////////////////////////

			// "inLine"
			// default value when its value is iqual true
			var inLineDefaultValue = {
				realce: false
			};
			var inLine;
			if (opts.inLine === true) { //opts.inLine: true
				inLine = inLineDefaultValue;
			} else if (angular.isObject(opts.inLine)) { //opts.inLine: {...}	
				inLine = opts.inLine;
			} else { 
				throw new Error('"find": param "inLine" passed in a wrong way');
			}


			// "inLine.realce"
			// default value when its value is iqual true
			var inLineRealceDefaultValue = {
				style: 'background-color:#FFFF00;color:black;padding:1px;'
			};
			var inLineRealce;
			if (inLine.realce) {
				if (inLine.realce == true) { //opts.inLine.realce: true
					inLine.realce = inLineRealceDefaultValue;
				} else { //opts.inLine: {...}
					inLine.realce = opts.inLine.realce;
					inLine.realce.style = inLine.realce.style || inLineRealceDefaultValue.style;
				}
			}

			// "inLine.scrollIntoView"
			inLine.scrollIntoView = (inLine.scrollIntoView == false ? false : true);

			/////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////

			controller.searchInfo = {
				'valuesToFind': valuesToFind,
				'opts': opts
			};

			var selectAndRemoveRendered = function(record, preventSelecionChange, scrollIntoView) {
				controller.options.api.selectRow(record, preventSelecionChange, scrollIntoView);
				var rowElement = controller.options.api.resolveRowElement(record);
				rowElement.attr('rendered', false);
			}

			//remove all selections
			controller.options.api.clearSelections();
			if (Array.isArray(recordsFound)) {
				//multiSelect
				if (controller.options.multiSelect) { 
					for (var index = 0 ; index < recordsFound.length ; index++) {
						selectAndRemoveRendered(recordsFound[index], index != 0, index == 0);		
					}	
				//singleSelect	
				} else {
					if (recordsFound.length > 1) {
						console.warn('"find": More than one record was returned, but as the "inLine" property is true and "multiSelect" is false, just the first record will be selected.');
					}	
					selectAndRemoveRendered(recordsFound[0], false, true);
				}	
			} else {
				if (recordsFound != null) {
					selectAndRemoveRendered(recordsFound, preventSelecionChange, scrollIntoView);
				}
			}


			controller.options.api.repaint();
		}
		/////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////


	 	return recordsFound;
	}


	/**
	 * 
	 *
	 */		 
	me.getRowHeight = function(controller) {
		return controller.options.rowHeight;
	}

	/**
	 * 
	 *
	 */		 
	me.setRowHeight = function(controller, rowHeight) {
		var rowElements = controller.bodyViewport.find('div.ui-row:not(.grouping-footer-container)');
		rowElements.css('height', controller.options.rowHeight);
	}


	/**
	 * @param record {Object|Number} Can be passed rowIndex or the object record
	 *
	 */		 
	me.getRowElement = function(controller, record) {
		var rowIndex = _resolveRowIndex(record);
		return me.bodyViewport.find('div.ui-row[rowIndex=' + rowIndex + ']');
	}	


	var _recreateAll = function(controller) {
		if (controller.options.data) {
			//Remmove all rows before load
			controller.bodyViewport.find('div.ui-deni-view-group-header').remove();		
			controller.bodyViewport.find('div.ui-row').remove();

			me.loadData(controller, controller.options.data);
		}	
	}

	/**
	 *	
	 *
	 */
	me.toogleGrouping = function(controller) {
		controller.options.enableGrouping = !controller.options.enableGrouping;
		_recreateAll(controller);
	}


	/**
	 *	
	 *
	 */
	me.isEnableGrouping = function(controller) {
		return controller.options.enableGrouping;
	},

	/**
	 *	
	 *
	 */
	me.isGrouped = function(controller) {
		return controller.isGrouped;
	},

	/**
	 *	
	 *
	 */
	me.setEnableGrouping = function(controller) {
		controller.options.enableGrouping = true;
		_recreateAll(controller);
	}

	/**
	 *	
	 *
	 */
	me.setDisableGrouping = function(controller) {
		controller.options.enableGrouping = false;
		_recreateAll(controller);
	}

	//
	//
	//
	//
	/*
	var _renderFixedRowEl = function(controller, itemToRender, record) {
		var fixedRow = $(document.createElement('div'));
		fixedRow.addClass('ui-fixed-row');		
		fixedRow.attr('rowindex', itemToRender.rowIndex.toString());
		fixedRow.css('left', '0px'); 		
		fixedRow.css('top', itemToRender.top + 'px');
		fixedRow.css('height', itemToRender.height + 'px');
		//.html(itemToRender.rowIndex.toString());

		controller.fixedColsBodyContainer.append(fixedRow);
	}	
	*/

	//
	//
	//
	//
	var _renderRowEl = function(controller, itemToRender, record) {

		var rowElement = $(document.createElement('div'));
		rowElement.addClass('ui-row');		
		rowElement.attr('rowindex', itemToRender.rowIndex.toString());
		rowElement.css('left', '0px'); 		

		var fixedRowElement;	
		if (controller.options.fixedCols) {
			fixedRowElement = $(document.createElement('div'));
			fixedRowElement.addClass('ui-row');		
			fixedRowElement.attr('rowindex', itemToRender.rowIndex.toString());
			fixedRowElement.css('left', '0px'); 		
			controller.fixedColsBodyContainer.append(fixedRowElement);
		}	
		
		//ROW DETAIL 
		if (itemToRender.rowDetails) {
			var rowElementParent = controller.bodyContainer.find('.ui-row[rowIndex=' + itemToRender.rowIndex + ']:not(.row-detail-container)');
			rowElement.insertAfter(rowElementParent);

			var isSelected = rowElementParent.find('.ui-cell:eq(0)').is('.selected');
			if (isSelected) {
				rowElement.addClass('selected');
			}
			rowElement.addClass('row-detail-container');

			var rowDetailsBox = $(document.createElement('div'));
			rowDetailsBox.addClass('row-detail-box');
			rowElement.append(rowDetailsBox);

			var rowElementParent = controller.options.api.resolveRowElement(itemToRender.rowIndex);

			rowElement.css('height', itemToRender.height + 'px');
			rowElement.css('top', itemToRender.top + 'px');
			rowElement.insertAfter(rowElementParent);

			rowElement.click(function() {
				controller.options.api.selectRow(rowElementParent);
			});

			itemToRender.rowElement = rowElement;


			if (controller.options.rowDetails.template) {
				var valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.rowDetails.template, record);
				itemToRender.rowElement.html(valueToRender);
			} else if (controller.options.rowDetails.renderer)	{
				controller.options.rowDetails.renderer(itemToRender.rowElements, record);
			}
		} else {
			controller.bodyContainer.append(rowElement);

			rowElement.css('height', itemToRender.height);
			rowElement.css('top', itemToRender.top + 'px'); 			
			if (controller.options.fixedCols) {
				fixedRowElement.css('height', itemToRender.height + 'px');
				fixedRowElement.css('top', itemToRender.top + 'px');
			}	

			// GROUPING	OR GROUPING	FOOTER
			if (angular.isDefined(itemToRender.children)) {

				//GROUPING FOOTER
				if (itemToRender.footerContainer) {
					rowElement.addClass('ui-grouping-footer-container'); 

				//GROUP
				} else {
					rowElement.addClass('row-detail');
					rowElement.addClass('grouping'); //added basically to not select this line
				}	

				//
				rowElement.attr('groupIndex', itemToRender.groupIndex);			
				rowElement.attr('children', itemToRender.children);

			} else {
				// GROUP CHILD
				if (angular.isDefined(itemToRender.groupIndex)) {
					rowElement.attr('groupIndex', itemToRender.groupIndex);		
					rowElement.attr('indexInsideGroup', itemToRender.indexInsideGroup);						

					// stripRows (odd line?)
					if (controller.options.stripRows) {
						if (itemToRender.indexInsideGroup % 2 == 1) {
							rowElement.addClass('odd-row');
						}
					}	

				// common row	
				} else {
					// stripRows (odd line?)
					if (controller.options.stripRows) {
						if (itemToRender.rowIndex % 2 == 1) {
							rowElement.addClass('odd-row');						
							if (controller.options.fixedCols) {
								fixedRowElement.addClass('odd-row');
							}	
						}
					}	
				}
			}
		}
		
		

		///////////////////////////////////////////////
		// onbeforerender event
		///////////////////////////////////////////////
		if (controller.options.listeners.onbeforerender) {
			controller.options.listeners.onbeforerender(rowElement, controller);
		}
		///////////////////////////////////////////////
		///////////////////////////////////////////////

		controller.options.listeners.onrenderer(rowElement, fixedRowElement, record, itemToRender.rowIndex, controller);

		///////////////////////////////////////////////
		// onafterrender event
		///////////////////////////////////////////////
		if (controller.options.listeners.onafterrender) {
			controller.options.listeners.onafterrender(rowElement, controller);
		}
		///////////////////////////////////////////////
		///////////////////////////////////////////////

		itemToRender.rendered = true;
		return rowElement;
	};

	/**
	 *	
	 *
	 */
	me.repaint = function(controller) {

		//
		var visibleRows = controller.managerRendererItems.getVisibleRows();

		//
		for (var index = 0 ; index < visibleRows.length ; index++) {
			var visibleRow = visibleRows[index];

			if (!visibleRow.rendered) {
				var record = controller.options.data[visibleRow.rowIndex];

				visibleRow.rowElement = _renderRowEl(controller, visibleRow, record);
			}	
		}

		///////////////////////////////////////////////
		// onafterrepaint event
		///////////////////////////////////////////////
		if (controller.options.listeners.onafterrepaint) {
			controller.options.listeners.onafterrepaint(controller);
		}
		///////////////////////////////////////////////
		///////////////////////////////////////////////

		// remove all not visible rows elements
		// preventing a overloading in the RAM memory
		controller.managerRendererItems.removeAllNotVisibleElementsRows(controller, visibleRows);
	};

	/**
	 * 
	 *
	 */		 
	me.getRowIndex = function(controller, record) {
		var data = controller.options.data;
		for (var index = 0 ; index < data.length ; index++) {
			var rec = data[index];
			if (angular.equals(rec, record)) {
				return index;
			}
		}
		return -1;
	}


	// This function help some other functions which get row parameter where sometimes
	// it comes like a record object and sometimes comes its rowIndex
	//
	// row {Number|Object|JQueryElement} Can be passed rowIndex, the object record or even the JQueryElement which corresponds to the object record
	// returns the JQuery Element which corresponds to the object record
	me.resolveRowElement = function(controller, row) {
		var rowIndex = -1;
		if (angular.isObject(row)) {  //passed the object record or the DOM element
			if (angular.isElement(row)) { //passed JQuery element
				return row;
			} else { //passed record object
				rowIndex = me.getRowIndex(controller, row);
			}
		} else { //passed rowIndex
			rowIndex = row;
		}

		//don't select grouping rows
		return controller.bodyViewport.find('.ui-row[rowindex=' + rowIndex + ']:not(.grouping)');
	}

	// This function help some other functions which get row parameter where sometimes
	// it comes like a record object and sometimes comes its rowIndex
	//
	// row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
	// returns the row index
	me.resolveRowIndex = function(controller, row) {
		if (angular.isObject(row)) {  //passed the object record or the DOM element
			if (angular.isElement(row)) { //passed DOM element
				return row.attr('rowindex');
			} else { //passed record object
				return me.getRowIndex(controller, row);
			}
		} else { //passed rowIndex
			return row;
		}
	}


	////////////////////////////////////////////////////////////////
	// PRIVATES METHODS
	////////////////////////////////////////////////////////////////

	//
	//
	//
	//

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////


});	
