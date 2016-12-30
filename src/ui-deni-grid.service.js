(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.service('uiDeniGridService', uiDeniGridService);

	function uiDeniGridService($compile, $timeout, $q, $http, $filter, uiDeniGridHelperService, uiDeniGridConstant, uiDeniGridDropdownService, uiDeniGridEventsService) {
		var me = this;

    me.sum = function(number1, number2) {
      return number1 + number2;
    };

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
		 };

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
		 };


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
			};

			if (controller.options.fixedCols) {
				angular.copy(columnsToCreate, columns);

				//Row Number?
				if (controller.options.fixedCols.rowNumber) {
					columns.splice(0, 0, {
						width: uiDeniGridConstant.FIXED_COL_ROWNUMBER_WIDTH,
						isFixedColumn: true
					});
				}

				//Indicator?
				if (controller.options.fixedCols.indicator) {
					columns.splice(0, 0, {
						width: uiDeniGridConstant.FIXED_COL_INDICATOR_WIDTH,
						isFixedColumn: true
					});
				}

				//CheckBox?
				if (controller.options.fixedCols.checkbox) {
					columns.splice(0, 0, {
						width: uiDeniGridConstant.FIXED_COL_CHECKBOX_WIDTH,
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
			//var columnHeaderLevels = uiDeniGridHelperService.getColumnHeaderLevels(me, me.options.columns);
			//
			var currentLevel = level || 1;

			//Any column was specified in percentage? TODO: create a function to get this
			var anyColumnInPercentage = false;
			for (var idx = 0 ; idx < controller.options.columns.length ; idx++) {
				if (controller.options.columns[idx].width.toString().indexOf('%') !== -1) {
					anyColumnInPercentage = true;
					break;
				}
			}

			//
			if (anyColumnInPercentage) {
				//controller.headerViewport.css('width', 'calc(100% - 17px)');
				let scrollbarWidth = controller.bodyViewport.get(0).offsetWidth - controller.bodyViewport.get(0).scrollWidth;
				controller.headerViewport.css('width', 'calc(100% - ' + scrollbarWidth + 'px)');
				controller.headerContainer.css('width', '100%');
			}

			var colIndex = colIndexStart || 0;

			//
			for (let index = 0 ; index < columns.length ; index++) {
				var column = columns[index];

				//ui-header-container-column
				var divHeaderContainerColumn = $(document.createElement('div'));

				//
				//if (anyColumnInPercentage) {
					divHeaderContainerColumn.css('width', column.width);
				//} else {
					//divHeaderContainerColumn.css('width', uiDeniGridHelperService.getRealColumnWidth(controller, column.width, clientWidthParent));
				//}

				divHeaderContainerColumn.addClass('ui-header-container-column');
				divHeaderContainerColumn.attr('colindex', colIndex);
				if (angular.isDefined(headerContainerColumnRow)) {
					if (index === 0) {
						divHeaderContainerColumn.addClass('first-subcolumn');
					} else if (index === columns.length - 1) {
						divHeaderContainerColumn.addClass('last-subcolumn');
					}
				}


				//ui-header-container-column-row
				var divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);

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

				//dropdown menu
				var spanHeaderCellDropdown = $(document.createElement('span'));
				spanHeaderCellDropdown.addClass('ui-header-cell-dropdown');
				spanHeaderCellDropdown.mouseenter(function() {
					let target = $(event.target);
					target.addClass('active');
				});
				spanHeaderCellDropdown.mouseout(function() {
					let target = $(event.target);
					if (!target.is('.clicked')) {
						target.removeClass('active');
					}
				});
				divHeaderCell.append(spanHeaderCellDropdown);

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
						var checkboxes = controller.fixedColsBodyContainer.find('.ui-cell-inner.checkbox').find('input[type=checkbox]');
						for (let index = 0 ; index < checkboxes.length ; index++) {
							checkboxes[index].checked = event.target.checked;
						}
					});

				} else {
					var content = column.header || column.name;
					spanHeaderCellInner.html(content);

					if (column.action) {
						//
						divHeaderContainerColumn.addClass('action-button-column');
						//
						divHeaderCell.addClass('action-button-column');
					}
				}


				//container param comes filled just when we creating sub columns (grouped column headers)
				if (angular.isDefined(headerContainerColumnRow)) {
					headerContainerColumnRow.append(divHeaderContainerColumn);
				} else {

					//fixed column?
					if ((column.isFixedColumn) || (uiDeniGridHelperService.isFixedColumn(controller, column.name))) {
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

		};

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
					if (!angular.isDefined(hrVerticalLineResizing)) {
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
			};

			var setResizing = function() {
				if (!hrVerticalLineResizing) {
					hrVerticalLineResizing = document.createElement('hr');
					hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
					controller.colsViewport.append(hrVerticalLineResizing);
				}
				updResizing();
			};

			var setResizingOff = function() {
				controller.resizing = false;
				//columnHeaderCellResizing = null;
				headerContainerColumnResizing = null;
				controller.colsViewport.css('cursor', 'default');
				if (hrVerticalLineResizing) {
					$(hrVerticalLineResizing).css('display', 'none');
				}
			};

			//Mouse Down
			controller.headerContainer.mousedown(function(event) {
				if (!controller.enabled) {
					return;
				}

				let headerContainerColumn = $(event.target).closest('.ui-header-container-column');
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
			};

			//It is necessary when there are grouped columns
			var adjustChildrenColumnsWidths = function(headerContainerColumn, newWidth) {
				//
				var children = headerContainerColumn.find('.ui-header-container-column');

				//
				if (children.length > 0) {
					//sum the widths
					var totalWidth = 0;
					for (let index = 0 ; index < children.length ; index++) {
						totalWidth += $(children[index]).width();
					}

					//get the column width percentage
					for (let index = 0 ; index < children.length ; index++) {
						var child = $(children[index]);
						var percentage = child.width() * 100 / totalWidth;

						child.css('width', (newWidth * percentage / 100) + 'px');
					}
				}
			};


			//Mouse Up
			$(document).mouseup(function(event){
				if (!controller.enabled) {
					return;
				}

				if (controller.resizing) {
					if (headerContainerColumnResizing) {
						//
						//let leftResizing = event.pageX - controller.colsViewport.offset().left;
						//let difference = event.clientX - headerContainerColumnResizing.getBoundingClientRect().right;
						let right = headerContainerColumnResizing.getBoundingClientRect().left + headerContainerColumnResizing.clientWidth;
						let difference = event.pageX - right;
						let $headerContainerColumnResizing = $(headerContainerColumnResizing);
						let newWidth = $headerContainerColumnResizing.width() + difference;

						//It is necessary when there are grouped columns
						if ($headerContainerColumnResizing.is('.has-subcolumns')) {
							//
							let lastSubcolumn = $headerContainerColumnResizing.find('.ui-header-container-column.last-subcolumn');
							let lastSubcolumnWidth = lastSubcolumn.width();
							//
							$headerContainerColumnResizing.width(newWidth);

							//
							let borderWidth = 1;
							lastSubcolumn.width(lastSubcolumnWidth + difference + borderWidth);
							//uiDeniGridHelperService.adjustColumnWidtsAccordingColumnHeader(controller, lastSubcolumn, lastSubcolumn.attr('colindex'));
							//
							//adjustChildrenColumnsWidths($headerContainerColumnResizing, newWidth);

							///////////////////////////////////////////////////////////////////////////////////////////
							// looking for children column headers - It is necessary when there are grouped columns
							///////////////////////////////////////////////////////////////////////////////////////////
							//
							//
							//var headerContainerColumns = $headerContainerColumnResizing.find('.ui-header-container-column');
							//for (let index = 0 ; index < headerContainerColumns.length ; index++) {
							//	var headerContainerColumn = $(headerContainerColumns.get(index));
							//	uiDeniGridHelperService.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, headerContainerColumn.attr('colindex'));
							//}
							///////////////////////////////////////////////////////////////////////////////////////////
							///////////////////////////////////////////////////////////////////////////////////////////
						} else {

							//
							let lastAdjustedParent = adjustParentColumnsWidths($headerContainerColumnResizing, difference);
							//
							$headerContainerColumnResizing.width(newWidth);
							//
							//uiDeniGridHelperService.adjustColumnWidtsAccordingColumnHeader(controller, $headerContainerColumnResizing, $headerContainerColumnResizing.attr('colindex'));
						}

						uiDeniGridHelperService.adjustAllColumnWidtsAccordingColumnHeader(controller);

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
						if (!immediate) {
							func.apply(context, args);
						}
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) {
						func.apply(context, args);
					}
				};
			};

			//Mouse Move
			$(document).mousemove(function(event) {
				if (!controller.enabled) {
					return;
				}

				if (controller.options.enableColumnResize) {

					if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)
						if (controller.resizing) {
							debounce(updResizing(), 100);
						}
					} else if (event.which === 0) { //event.which: left: 1, middle: 2, right: 3 (pressed)
						controller.colsViewport.css('cursor', 'default');

						let headerContainerColumn = $(event.target).closest('.ui-header-container-column');
						if (headerContainerColumn.length > 0) {

							var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
							canResize = false;
							//columnHeaderCellResizing = null;
							headerContainerColumnResizing = null;

							for (let index = 0 ; index < columnHeadersCell.length ; index++) {
								var columnHeaderCell = columnHeadersCell[index];

								var position = columnHeaderCell.getBoundingClientRect();
								if ((event.clientX > position.right - 2) && (event.clientX < position.right + 2)) {
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


			//
			var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
			for (let index = 0 ; index < columnHeadersCell.length ; index++) {
				var columnHeaderCell = $(columnHeadersCell[index]);

				//
				// Mouse Enter
				columnHeaderCell.mouseenter(function(event) {
					if (!controller.enabled) {
						return;
					}

					$(event.currentTarget).addClass('hover');
				});

				//
				// Mouse Leave
				columnHeaderCell.mouseleave(function(event) {
					if (!controller.enabled) {
						return;
					}

					$(event.currentTarget).removeClass('hover');
				});

				//
				// Mouse Up
				columnHeaderCell.mouseup(function(event) {
					if (!controller.enabled) {
						return;
					}

					if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)

						let target = $(event.target);
						let headerCell = target.closest('.ui-header-cell');
						let fieldName = headerCell.attr('name');
						let column = me.getColumn(controller, fieldName);
						let isDropDownMenu = target.is('.ui-header-cell-dropdown');


						if (isDropDownMenu) {
							target.addClass('active clicked');

							let mousePoint = getPositionDropDownMenuColumns(target.get(0));
							let dropdownMenuCallbackFunctionFn = function(column, execSortObj, execFilter) {
								dropdownMenuCallbackFunction(controller, column, execSortObj, execFilter);
							};
							let sortable = (controller.options.sortableColumns && (column.sortable !== false));
							uiDeniGridDropdownService.open(controller, sortable, column, mousePoint, dropdownMenuCallbackFunctionFn);

						} else {
							if (controller.colsViewport.css('cursor') === 'default') { //prevent conflict with the resizing columns function
								if ((controller.options.sortableColumns) && (column.sortable !== false)) {
									let headerContainerColumn = $(event.target.closest('.ui-header-container-column'));

									//Action column should not be ordered
									if (!headerContainerColumn.is('.action-button-column')) {
										let headerCellInner = headerCell.find('.ui-header-cell-inner');
										let direction = 'ASC'; //default
										if (headerCellInner.is('.asc')) {
											direction = 'DESC';
										}

										if (!headerContainerColumn.is('.has-subcolumns')) {
											controller.element.api.sort({name: headerCell.attr('name'), direction: direction});
										}
									}
								}
							}
						}

					}
				});
			}

		};

		var dropdownMenuCallbackFunction = function(controller, column, execSortObj, execFilter) {
			controller.headerContainer.find('.ui-header-cell-dropdown').removeClass('active clicked');

			if (execSortObj) {
				controller.element.api.sort(execSortObj);
			} else if (column.filter && execFilter) {
				controller.element.api.filter(controller.scope.filterModel);
			}
		};

		/**
		 *
		 *
		 *
		 */
		var getPositionDropDownMenuColumns = function(dropDowmButtonEl) {
			var xPos = 0;
			var yPos = 0;
			var el = dropDowmButtonEl;

			while (el) {
				if (el.tagName === 'BODY') {
					// deal with browser quirks with body/window/document and page scroll
					var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
					var yScroll = el.scrollTop || document.documentElement.scrollTop;

					xPos += (el.offsetLeft - xScroll + el.clientLeft);
					yPos += (el.offsetTop - yScroll + el.clientTop);
				} else {
					// for all other non-BODY elements
					xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
					yPos += (el.offsetTop - el.scrollTop + el.clientTop);
				}

				el = el.offsetParent;
			}
			return {
				x: xPos,
				y: yPos + dropDowmButtonEl.offsetHeight - 1
			};
		};


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
					for (let index = 0 ; index < array.length ; index++) {
						var sort = array[index];
						var direction = sort.direction || 'ASC'; //default value
						controller.options.data = $filter('orderBy')(controller.options.data, sort.name, direction.toUpperCase() === 'DESC');
					}
				};
				// Are there fixed sorters?
				if (controller.options.fixedSorters) {
					sortFn(controller.options.fixedSorters);
				}

				sortFn(sortersArray);
			}

			return sortersArray;
		};

		/*
		 *
		 *
		 *
		 */
		var _repaintCardView = function(controller, visibleRow) {
			//It might have more than one record by row whe is configured "cardView" property
			var recordsByRow = controller.options.cardView.numberOfColumns;

			//
			var rowElement = $(document.createElement('div'));
			rowElement.addClass('ui-row');
			rowElement.attr('rowindex', visibleRow.rowIndex);
			rowElement.css('left', '0px');
			rowElement.css('height', visibleRow.height);
			rowElement.css('width', '100%');
			rowElement.css('top', visibleRow.top + 'px');
			rowElement.html('<table class="ui-table-card-view"><tr></tr></table>');
			controller.bodyContainer.append(rowElement);
			var rowTableRowCardView = rowElement.find('tr').get(0);
			var colWidth = (100 / recordsByRow).toString() + '%';

			//
			for (let indexRecord = 0 ; indexRecord < recordsByRow ; indexRecord++) {
				var indexDataRecord = visibleRow.rowIndex;
				//
				if (visibleRow.rowIndex > 0) {
					indexDataRecord = ((visibleRow.rowIndex) * recordsByRow);
				}
				indexDataRecord += indexRecord;

				var record = controller.options.data[indexDataRecord];

				var divCell = $(rowTableRowCardView.insertCell());
				divCell.css('width', colWidth);
				if (record) {
					var valueToRender = uiDeniGridHelperService.applyTemplateValues(controller.options.cardView.template, record);
					divCell.html(valueToRender);
					divCell.prop('record', record);

					divCell.click(function(event) {
						controller.bodyContainer.find('td').removeClass('selected');
						$(event.currentTarget).addClass('selected');

						////////////////////////////////////////////////////
						//onselectionchange event
						////////////////////////////////////////////////////
						if (controller.options.listeners.onselectionchange) {
							controller.options.listeners.onselectionchange(controller, controller.element, indexDataRecord, $(event.currentTarget).prop('record'));
						}
						////////////////////////////////////////////////////
						////////////////////////////////////////////////////

					});

					if (controller.options.cardView.checkbox === true) {
						var checkboxCardView = $(document.createElement('input'));
						checkboxCardView.addClass('checkbox');
						checkboxCardView.attr('type', 'checkbox');
						if (controller.checkedRecords.indexOf(record) !== -1) {
							checkboxCardView.attr('checked', true);
						}
						checkboxCardView.click(function(event) {
							var rec = $(event.target.parent).prop('record');
							var indexOfRec = controller.checkedRecords.indexOf(rec);

							if (indexOfRec !== -1) {
								controller.checkedRecords.splice(indexOfRec, 1);
							}

							if (event.target.checked) {
								controller.checkedRecords.push(rec);
							}

							if (controller.options.listeners.oncheckboxchange) {
								controller.options.listeners.oncheckboxchange(rec, controller.checkedRecords, event.target);
							}
						});
						divCell.append(checkboxCardView);
					}

				}
			}
			visibleRow.rowElement = rowElement;
		};


		/*
		 *
		 *
		 *
		 */
		var _repaintRow = function(controller, rowIndex, forceRepaint, execAfterRepaintEvent, rowObject) {
			var itemRow = rowObject || controller.managerRendererItems.getInfoRow(rowIndex);
			if (forceRepaint) {
				itemRow.rendered = false;
				if (angular.isDefined(itemRow.rowElement)) {
					itemRow.rowElement.remove();
				}
				itemRow.rowElement = undefined;
			}

			if (!itemRow.rendered) {

				// Card View
				if (angular.isDefined(controller.options.cardView)) {
					_repaintCardView(controller, itemRow);

				// Not a Card View
				} else {
					var record = controller.options.data[itemRow.rowIndex];
					itemRow.rowElement = _renderRowEl(controller, itemRow, record);
				}

				///////////////////////////////////////////////
				// onafterrepaintrow event
				///////////////////////////////////////////////
				if (itemRow.rowElement) {
					if (controller.options.listeners.onafterrepaintrow) {
						controller.options.listeners.onafterrepaintrow(itemRow.rowIndex, itemRow.rowElement);
					}
				}
				///////////////////////////////////////////////
				///////////////////////////////////////////////


				if (execAfterRepaintEvent) {
					///////////////////////////////////////////////
					// onafterrepaint event
					///////////////////////////////////////////////
					if (uiDeniGridEventsService.onafterrepaint) {
						uiDeniGridEventsService.onafterrepaint(controller);
					}
					///////////////////////////////////////////////
					///////////////////////////////////////////////
				}
			}
		};

		/*
		 *
		 *
		 *
		 */
		var _repaint = function(controller, forceRepaint) {

			/*
			//
			if (forceRepaint) {
				controller.managerRendererItems.setAllElementsToNotRendered();
			}
			*/

			//
			var visibleRows = controller.managerRendererItems.getVisibleRows();

			//
			for (let index = 0 ; index < visibleRows.length ; index++) {
				var visibleRow = visibleRows[index];
				_repaintRow(controller, visibleRow.rowIndex, forceRepaint, null, visibleRow);
			}

			///////////////////////////////////////////////
			// onafterrepaint event
			///////////////////////////////////////////////
			if (uiDeniGridEventsService.onafterrepaint) {
				uiDeniGridEventsService.onafterrepaint(controller);
			}
			///////////////////////////////////////////////
			///////////////////////////////////////////////

			// remove all not visible rows elements
			// preventing a overloading in the RAM memory
			controller.managerRendererItems.removeAllNotVisibleElementsRows(controller, visibleRows);
		};

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
			if (holdSelection !== false) {
				recordToHold = me.getSelectedRow(controller);
			}

			controller.headerContainer.find('span.ui-header-cell-inner').removeClass('sort').removeClass('asc').removeClass('desc'); //remove all sorters icons

			var sortersArray;

			//GROUPING
			if (controller.element.api.isGrouped()) {
				sortersArray = _sort(controller, sorters);

				//
				controller.bodyContainer.find('.ui-row.collapse').filter(function() {
					var rowElementGroupExpanded = $(this);
					var groupIndex = parseInt(rowElementGroupExpanded.attr('groupIndex'));
					var rowIndex = parseInt(rowElementGroupExpanded.attr('rowindex'));
					var record = controller.options.data[rowIndex];

					uiDeniGridHelperService.groupCollapse(controller, rowElementGroupExpanded, record, rowIndex);
					uiDeniGridHelperService.groupExpand(controller, rowElementGroupExpanded, record, rowIndex);
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
				controller.element.api.loadData(controller.options.data);

				for (let index = 0 ; index < recordsToExpand.length ; index++) {
					var record = recordsToExpand[index];
					var rowIndex = controller.element.api.resolveRowIndex(record);
					var rowElement = controller.element.api.resolveRowElement(rowIndex);

					uiDeniGridHelperService.rowDetailsExpand(controller, rowElement, record, rowIndex);
				}
				_repaint(controller);

			//COMMON ROW
			} else {
				sortersArray = _sort(controller, sorters);

				//
				controller.element.api.loadData(controller.options.data);
			}


			for (let index = 0 ; index < sortersArray.length ; index++) {
				var sort = sortersArray[index];

				if (!angular.isFunction(sort)) {
					var headerColElement = $(_getHeaderColElementByName(controller, sort.name, true));
					var headerCellInnerElem = headerColElement.find('.ui-header-cell-inner');
					headerCellInnerElem.addClass('sort');
					headerCellInnerElem.addClass(sort.direction ? sort.direction.toLowerCase() : 'asc');
				}
			}

			//Call ui-deni-view method sort
			//controller.element.api.sort(sortersArray);

			if (recordToHold) {
				me.selectRow(controller, recordToHold);
			}


			return sortersArray;
		};

		/**
		 * @param raiseError {boolean} Raise a error when it is not found
		 *
		 */
		var _getHeaderColElementByName = function(controller, columnName, raiseError) {
			let columns = controller.headerContainer.find('div.ui-header-cell[name="' + columnName + '"]');
			if (columns.length === 0) {
				if (raiseError) {
					throw new Error('There is not a columns with a name "' + columnName + '"!');
				} else {
					return null;
				}
			} else {
				return columns[0];
			}
		};

		/**
		 *
		 */
		me.getSelectedRow = function(controller) {
			if (controller.rowIndex === undefined) {
				return null;
			} else {
				return controller.options.data[controller.rowIndex];
			}
		};

		/**
		 *
		 */
		me.getChangedRecords = function(controller) {
			var changedRows = controller.bodyViewport.find('div.ui-row.changed');
			var data = controller.options.data;
			var changedRecords = [];
			for (let index = 0 ; index < changedRows.length ; index++) {
				var rowIndex = $(changedRows[index]).attr('rowindex');
				var changedRecord = data[rowIndex];
				changedRecords.push(changedRecord);
			}
			return changedRecords;
		};

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
		};

		//
		//
		//
		//
		//
		//
		var _resolveJQueryElement = function(element) {
			// If element is already a jQuery object
			if(angular.isElement(element)) {
			    return element;
			} else {
				return $(element);
			}
		};

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
		};

		/**
		 *	row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
		 *
		 */
		me.isRowSelected = function(controller, row) {
			var rowElement = controller.element.api.resolveRowElement(row);
			return rowElement.is('.selected');
		};

		/**
		 *
		 * return a integer value (see also getSelectedRowIndexes)
		 */
		me.getSelectedRowIndex = function(controller) {
			return controller.rowIndex;
		};

		/**
		 *
		 * return a array (see also getSelectedRowIndex)
		 *
		 */
		me.getSelectedRowIndexes = function(controller) {
			var rowIndexes = [];

			//
			var selectedRows = controller.bodyViewport.find('.ui-row.selected');

			//
			for (let index = 0 ; index < selectedRows.length ; index++) {
				rowIndexes.push(parseInt($(selectedRows[index]).attr('rowindex')));
			}

			return rowIndexes;
		};


		/**
		 *	row {Object|Number} Can be passed rowIndex or the object record
		 *  preventOnSelectionChange {Boolean} default false
		 *  scrollIntoView {Boolean} default true
		*/
	    me.selectRow = function(controller, row, preventOnSelectionChange, scrollIntoView) {
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
		    		if (controller.element.api.isGrouped()) {
		    			//
		    			rowIndex = controller.element.api.resolveRowIndex(row);
		    		//
		    		} else {
		    			rowIndex = controller.element.api.resolveRowIndex(row);
		    		}

			    	//
			    	//var rowElement = controller.element.api.resolveRowElement(row);

		    		//
		    		scrollIntoView = (scrollIntoView === false ? false : true);

					//
					if (rowIndex === -1) {
						throw new Error('selectRow: row passed in a wrong way!');
					}

					//
					let scrollIntoViewFn = function(rowElementToScroll) {
						if (scrollIntoView) {
							//if (!controller.element.api.isRowVisible(rowElementToScroll)) {
							//	rowElementToScroll.get(0).scrollIntoView(false);
							//}
						}
					};

					//if (rowIndex == controller.rowIndex) {
					if (me.isRowSelected(controller, rowIndex)) {
						//
						scrollIntoViewFn(rowIndex);
					} else {
						controller.rowIndex = rowIndex;

						if (controller.element.api.isGrouped()) {
							let itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
							if (!itemRow) {
								let groupIndex = controller.options.data[rowIndex].groupIndex;
								let groupInfo = controller.managerRendererItems.getInfoGroup(groupIndex);
								controller.colsViewport.scrollTop(groupInfo.top);
								_repaint(controller);
								let record = controller.options.data[rowIndex];
								uiDeniGridHelperService.groupExpand(controller, groupInfo.rowElement, record, rowIndex);
								itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
							}

							controller.colsViewport.scrollTop(itemRow.top);
							_repaint(controller);

							rowElement = itemRow.rowElement;
						} else {
			    			let rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));
			    			//let scrollTop = (rowIndex * rowHeight) - controller.bodyViewportWrapper.height() / 2;
			    			//controller.bodyViewport.scrollTop(scrollTop);
			    			_repaint(controller);
			    			let itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
			    			rowElement = itemRow.rowElement;
						}

					}
				}

				//
				if ((controller.rowIndex !== undefined) && (!controller.options.multiSelect)) {
					//remove all selections
					controller.element.api.clearSelections();
				}

				//
				rowElement.addClass('selected');

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
				if (!preventOnSelectionChange) {
					if (controller.options.listeners.onselectionchange) {
						controller.options.listeners.onselectionchange(controller, controller.element, controller.rowIndex, controller.options.data[controller.rowIndex]);
					}
				}
				////////////////////////////////////////////////////
				////////////////////////////////////////////////////

			} else {
				throw new Error('"selectRow": There is not record to select!');
			}
	    };

		/**
		 *	row {Object|Number} Can be passed rowIndex or the object record
		 *  preventOnSelectionChange {Boolean} default false
		 *  scrollIntoView {Boolean} default true
		 *  colIndex {Integer} Column Index.
		*/
	    me.selectCell = function(controller, row, colIndex, preventOnSelectionChange, scrollIntoView) {
	    	if ((controller.options.data) && (controller.options.data.length > 0)) {

	    		//
	    		scrollIntoView = (scrollIntoView === false ? false : true);

	    		//
	    		var rowElement = controller.element.api.resolveRowElement(row);
				//
				if (row.length === 0) {
					throw new Error('selectCell: row passed in a wrong way!');
				}

	    		var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
				//
				if (divCell.length === 0) {
					throw new Error('selectCell: colIndex passed in a wrong way!');
				}

				if (!controller.options.multiSelect) {
					//remove all selections
					controller.element.api.clearSelections();
				}

				divCell.addClass('selected');

	    		//
	    		var rowIndex = controller.element.api.resolveRowIndex(row);
				controller.rowIndex = rowIndex;
				controller.colIndex = colIndex;
			}
	    };


		/**
		 *
		 *
		*/
	    me.getColumn = function(controller, fieldName) {
			for (let index = 0 ; index < controller.options.columns.length ; index++) {
				if (controller.options.columns[index].name === fieldName) {
					return controller.options.columns[index];
				}
			}

			return null;
	    };

		/**
		 *
		 *
		*/
		me.updateSelectedRow = function(controller, json) {

			if (controller.rowIndex === undefined) {
				throw 'You have to select a record';
			} else {
				//
				var fieldsNotNested = uiDeniGridHelperService.prepareForNestedJson(json);
				//
				var keyFieldsToChange = Object.keys(fieldsNotNested);
				//
				var record = controller.options.data[controller.rowIndex];
				//
				var dataKeys = 	Object.keys(record);

				//
				for (let index = 0 ; index < keyFieldsToChange.length ; index++) {
					var fieldNameToChange = keyFieldsToChange[index];

					if (dataKeys.indexOf(fieldNameToChange) === -1) {
						console.warn('"updateSelectedRow" : field "' + fieldNameToChange + '" not found!');
					} else {
						//
						var newValue = eval('json.' + fieldNameToChange);
						record[fieldNameToChange] = newValue;
					}
				}

				//
				_repaintRow(controller, controller.rowIndex, true, true);
			}
		};

		/**
		 *
		 *
		*/
		me.updateCell = function(controller, rowIndex, colIndex, value) {
			var rowElement = controller.element.api.resolveRowElement(rowIndex);
			var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
			var spanCellInner = divCell.find('.ui-cell-inner');
			spanCellInner.html(value);

			//
			divCell.addClass('changed');
			//When we need the changed records we can get by ".ui-row.changed"
			divCell.closest('.ui-row').addClass('changed');
		};

		/**
		 *
		 *
		*/
		me.updateSelectedCell = function(controller, value) {

			if ((!angular.isDefined(controller.rowIndex)) || (!angular.isDefined(controller.colIndex))) {
				throw 'You have to select a record';
			} else {
				me.updateCell(controller, controller.rowIndex, controller.colIndex, value);
			}

		};


		/**
		 *
		 *
		*/
		me.isHideHeaders = function(controller) {
			return controller.options.hideHeaders;
	    };

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
		};

		/**
		 *
		 *
		 */
		me.getPageNumber = function(controller) {
			return controller.options.paging.currentPage;
		};

		/**
		 *
		 *
		 */
		me.setPageNumber = function(controller, pageNumber) {
			//controller.options.paging.currentPage = pageNumber;
			controller.paging.find('input.input-page-number').val(pageNumber);
			me.reload(controller, pageNumber);
			_checkDisableButtonsPageNavigation(controller, controller.options.data, pageNumber);
		};

		/**
		 *
		 *
		 */
		var _checkDisableButtonsPageNavigation = function(controller, data, pageNumber) {
			var firstButton = controller.paging.find('.button.button-first');
			var prevButton = controller.paging.find('.button.button-prev');
			var nextButton = controller.paging.find('.button.button-next');
			var lastButton = controller.paging.find('.button.button-last');
			var additionalButtons = controller.paging.find('.button.button-additional');

			var backwards = (data.length > 0) && (pageNumber > 1);
			var forwards = (data.length > 0) && (pageNumber < controller.options.paging.pageCount);

			if (data.length > 0) {
				additionalButtons.removeClass('disabled');
			} else {
				additionalButtons.addClass('disabled');
			}

			if (backwards) {
				firstButton.removeClass('disabled');
				prevButton.removeClass('disabled');
			} else {
				firstButton.addClass('disabled');
				prevButton.addClass('disabled');
			}

			if (forwards) {
				nextButton.removeClass('disabled');
				lastButton.removeClass('disabled');
			} else {
				nextButton.addClass('disabled');
				lastButton.addClass('disabled');
			}
		};

		var _getPropertyXML = function(properties, item, parentProperty) {
			var property = item.nodeName.toLowerCase();
			if (parentProperty) {
				property = parentProperty + '.' + property;
			}
			if (properties.indexOf(property) === -1) {
				properties.push(property);

				for (let index = 0 ; index < item.children.length ; index++) {
					_getPropertyXML(properties, item.children[index], property);
				}
			}
		};

		/**
		 *
		 *
		 */
		var isArrayItem = function(itemToBeAnalyzed) {
			if ((angular.isDefined(itemToBeAnalyzed.children)) && (itemToBeAnalyzed.children.length > 0)) {
				var propName = '';
				for (var i = 0 ; i < itemToBeAnalyzed.children.length ; i++) {
					if (propName === '') {
						propName = itemToBeAnalyzed.children[i].nodeName.toLowerCase();
					} else {
						if (itemToBeAnalyzed.children[i].nodeName.toLowerCase() !== propName) {
							return false;
						}
					}
				}

				return true;
			} else {
				return false;
			}
		};

		/**
		 *
		 *
		 */
		var _getRecordXML = function(records, item, parentNode) {
			var record = parentNode ? parentNode : {};

			for (let index = 0 ; index < item.children.length ; index++) {
				var property = item.children[index];
				var propertyName = property.nodeName.toLowerCase();

				if (property.children.length === 0) {
					record[propertyName] = property.textContent;
				} else {
					if (isArrayItem(property)) {
						var valueArray = [];
						for (var childIndex = 0 ; childIndex < property.children.length ; childIndex++) {
							_getRecordXML(valueArray, property.children[childIndex]);
						}
						record[propertyName] = valueArray;
					} else {
						record[propertyName] = {};
						_getRecordXML(records, property, record[propertyName]);
					}
				}
			}
			if (!angular.isDefined(parentNode)) {
				records.push(record);
			}
		};


		/**
		 *
		 *
		 */
		var _xmlToJson = function(controller, xml) {
			var xmlData = $(xml);
			var items = xmlData.find(controller.options.restConfig.data).find(controller.options.restConfig.dataItems);
			var records = [];
			for (let index = 0 ; index < items.length ; index++) {
				_getRecordXML(records, items[index]);
			}

			var jsonReturn = {
				success: true,
			};
			jsonReturn[controller.options.restConfig.data] = records;
			jsonReturn[controller.options.restConfig.total] = parseInt(xmlData.find(controller.options.restConfig.total).text());

			return jsonReturn;
		};

		/**
		 *
		 *
		 */
		var _getDefaultRequestPromise = function(url) {
			var deferred = $q.defer();

			$http.get(url)
				.then(
					function(response) {
						deferred.resolve(response);
					},
					function(response) {
						deferred.reject(response);
					}
				);

			return deferred.promise;
		};

		/**
		 * pageNumber Optional param
		 *
		 */
		me.load = function(controller, pageNumber) {
			let deferred = $q.defer();
			if (controller.options.url) {
				if (!controller.options.data) {
					controller.bodyViewport.addClass('initilizing-data');
				}
				let url = controller.options.url;

				if (controller.options.paging) {
					controller.options.paging.currentPage = pageNumber || 1;
					let page = controller.options.paging.currentPage;
					controller.paging.find('input.input-page-number').val(page);
					let limit = controller.options.paging.pageSize;
					let start = (page - 1) * limit;

					if (url.indexOf('?') === -1) {
						url += '?';
					} else {
						url += '&';
					}

					url += 'page=' + page + '&' + controller.options.restConfig.start + '=' + start + '&' + controller.options.restConfig.limit + '=' + limit;
				}

				if (controller.options.filter && controller.options.filter.remote) {
					//Is any filter set?
					if (Object.keys(controller.options.filter.model).length !== 0) {
						if (url.indexOf('?') === -1) {
							url += '?';
						} else {
							url += '&';
						}

						url += 'filter=' + JSON.stringify(controller.options.filter.model);
					}
				}

				//var loading = controller.wrapper.find('.ui-deni-grid-loading');
				//loading.css('display', 'block');
				var requestPromise = controller.options.requestPromise;
				if (!controller.options.requestPromise) {
					requestPromise = _getDefaultRequestPromise;
				}

				controller.loading = true;
				requestPromise(url)
					.then(function(response) {
						controller.loading = false;

						var responseData;

						if (controller.options.restConfig.type === 'xml') {
							responseData = _xmlToJson(controller, response.data);
						} else {
							responseData = response.data;
						}
						if (angular.isArray(responseData)) {
							responseData = {
								success: true,
								data: responseData,
								total: responseData.length
							};
						}

						//
						if (controller.options.paging) {
							//
							controller.options.paging.dataLength = responseData[controller.options.restConfig.total];

							controller.options.paging.pageCount = Math.ceil(controller.options.paging.dataLength / controller.options.paging.pageSize);

							//
							controller.element.api.loadData(responseData[controller.options.restConfig.data]);
							deferred.resolve(responseData[controller.options.restConfig.data]);

							//
							controller.paging.find('.label-page-count').html('of ' + controller.options.paging.pageCount);

							//
							var limit = controller.options.paging.pageSize;
							var start = (controller.options.paging.currentPage - 1) * limit;
							var end = start + controller.options.paging.pageSize;

							if (end > controller.options.paging.dataLength) {
								end = controller.options.paging.dataLength;
							}
							controller.paging.find('.label-displaying').html(start + ' - ' + end);

							controller.paging.find('.label-record-count').html(controller.options.paging.dataLength + ' records');

						} else {
							//
							controller.element.api.loadData(responseData[controller.options.restConfig.data]);
							deferred.resolve(responseData[controller.options.restConfig.data]);
						}

						controller.bodyViewport.removeClass('initilizing-data');
					},
					function(response) {
						controller.loading = false;
						deferred.reject(response.statusText);
	    			});
			} else {
				controller.loading = false;
				deferred.reject('"load" : To use load function is necessary set the url property.');
			}

			return deferred.promise;
		};

		/**
		 * pageNumber Optional param
		 *
		 */
		me.reload = function(controller, pageNumber) {
			return me.load(controller, pageNumber);
		};


		/**
		 *
		 *
		 */
		me.loadData = function(controller, data) {
			///////////////////////////////////////////////////////////////////////////
			//BeforeLoad Event
			///////////////////////////////////////////////////////////////////////////
			if (controller.options.listeners.onbeforeload) {
				controller.options.listeners.onbeforeload(data, controller.options);
			}
			//////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////

			//Are there footer?
			if (uiDeniGridHelperService.hasColumnFooter(controller)) {
				//
				uiDeniGridHelperService.renderColumnFooters(controller, controller.footerContainer, controller.options.columns, data, true);
				//
				uiDeniGridHelperService.remakeHeightBodyViewportWrapper(controller);
			}


			//
			controller.renderedIndexes = [];

			//
			let filterModelKeys = Object.keys(controller.options.filter.model);

			//Load the data
			if ((controller.options.filter) && (filterModelKeys.length > 0) && (!controller.options.filter.remote)) {
				let matchFilterFn = function(originalValue, valueToFilter) {

					//When valueToFilter comes from a multi select filter value, enter in this if
					if (angular.isArray(valueToFilter)) {
						let matched = false;
						for (let index = 0 ; index < valueToFilter.length ; index++) {
							let valueToFilterItem = valueToFilter[index];
							if (matchFilterFn(originalValue, valueToFilterItem)) {
								matched = true;
							} else {
								matched = false;
								break;
							}
						}
						return matched;
					} else {
						if (valueToFilter.oper === '=') {
							return originalValue.toString().toLowerCase() === valueToFilter.value.toString();
						} else if (valueToFilter.oper === '~') {
							//Case Insensitive Comparation
							return originalValue.toString().search(new RegExp(valueToFilter.value, 'i')) !== -1;
						} else if (valueToFilter.oper === '<=') {
							return valueToFilter.value <= originalValue;
						} else if (valueToFilter.oper === '>=') {
							return valueToFilter.value >= originalValue;
						} else {
							throw new Error('Invalid operator!');
						}
					}
				};
				let columns = controller.options.columns;
				controller.options.data = $filter('filter')(data, function(record, index, array) {
					if (controller.options.filter.allFields) {
						for (let colIndex = 0 ; colIndex < columns.length ; colIndex++) {
							let colName = columns[colIndex].name;
							let value = record[colName];
							if (value) {
								if (matchFilterFn(value, controller.options.filter.model['*'])) {
									return true;
								}
							}
						}
					} else {
						let filterOk = false;
						for (let index = 0 ; index < filterModelKeys.length ; index++) {
							let valuesToFilterKey = filterModelKeys[index];
							let valueToFilter = controller.options.filter.model[valuesToFilterKey];
							let value = eval('record.' + valuesToFilterKey);

							if (value && valueToFilter) {
								if (matchFilterFn(value, valueToFilter)) {
									filterOk = true;
								} else {
									return false;
								}
							}
						}
						return filterOk;
					}

					return false;
				});
			} else {
				controller.options.data = data;
			}

			controller.options.alldata = data;

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
			if (controller.element.api.isGrouped()) {
				var expressionToGroup = controller.options.grouping.expr;

				var getEvalFieldValue = function(record, fieldName) {
					return eval('record.' + fieldName);
				};

				var getEvalExpressionValue = function(record, expression) {
					var evalStr = '(function() {\n' +
				    			  '		with (record) {\n' +
								  '				return ' + expression + '\n' +
								  '		}\n' +
								  '})()';

					return eval(evalStr);
				};

				var fieldsNotNested = uiDeniGridHelperService.prepareForNestedJson(controller.options.data[0]);
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

				//controller.element.api.sort(sortGroupingFn);
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
				for (let index = 0 ; index < controller.options.data.length ; index++) {
					var record = controller.options.data[index];
					var value = functionToEvaluate(record, expressionToGroup);

					//
					if (oldValue === value) {
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
				var heightBodyContainer;
				if (controller.options.cardView) {
					heightBodyContainer = (Math.ceil(controller.options.data.length / controller.options.cardView.numberOfColumns) * rowHeight);
				} else {
					heightBodyContainer = (controller.options.data.length * rowHeight);
				}

				//
				controller.bodyContainer.height(heightBodyContainer + 2);

				if (controller.options.fixedCols) {
				  controller.fixedColsBodyContainer.height(controller.bodyContainer.height());
				}
			}

			//
			controller.managerRendererItems.createItems();

			//
			_repaint(controller);

			uiDeniGridHelperService.remakeHeightBodyViewportWrapper(controller);

			if (controller.options.data.length > 0) {
				controller.element.api.selectRow(0, false, false);
			}

			///////////////////////////////////////////////////////////////////////////
			//AfterLoad Event
			///////////////////////////////////////////////////////////////////////////
			if (controller.options.listeners.onafterload) {
				controller.options.listeners.onafterload(controller.options.data, controller.options);
			}
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////

			if (controller.options.paging) {
				_checkDisableButtonsPageNavigation(controller, data, controller.options.paging.currentPage);
			}
		};


		me.findKey = function(controller, keyValue, opts) {
			var valuesToFind = JSON.parse('{"' + controller.options.keyField + '": "' + keyValue + '"}');
			return me.find(controller, valuesToFind, opts);
		};

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
		 	if (data.length === 0) {
				throw new Error ('"Find" : There is no data to find!');
		 	} else if (keys.length === 0) {
				throw new Error ('"Find" : param "valuesToFind" must be informed!');
		 	}

		 	////////////////////////////////////////////////////////////////////////////////
		 	//get the opt parameter and fill the detault values too
		 	////////////////////////////////////////////////////////////////////////////////
		 	opts = opts || {};
		 	var exactSearch = (opts.exactSearch === false ? false : true); //Exact search? default = true (only used for string values)
		 	var all = (opts.all === true ? true : false); //Return all records found? default = false (In this case the search stop when the first record is found)
		 	var ignoreCase = (opts.ignoreCase === true ? true : false); //Ignore case when comparing strings (only used for string values)
		 	////////////////////////////////////////////////////////////////////////////////

		 	var recordsFound = [];
		 	var breakParentLoop = false;

		 	var newJson = uiDeniGridHelperService.prepareForNestedJson(valuesToFind);
		 	keys = Object.keys(newJson);
		 	////////////////////////////////////////////////////////////////////////////////
		 	////////////////////////////////////////////////////////////////////////////////
		 	var found = false;

		 	//loop over the data
		 	for (let index = 0 ; index < data.length ; index++) {
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
						foundRecord = valueToFind === value;
					} else {
						foundRecord = value.indexOf(valueToFind) !== -1;
					}

					if (!foundRecord) {
						continue;
					}
			 	}

		 		if (foundRecord) { //found record?
		 			found = true;

					recordsFound.push(record);
					if (!all) {
						break;
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
					if (inLine.realce === true) { //opts.inLine.realce: true
						inLine.realce = inLineRealceDefaultValue;
					} else { //opts.inLine: {...}
						inLine.realce = opts.inLine.realce;
						inLine.realce.style = inLine.realce.style || inLineRealceDefaultValue.style;
					}
				}

				// "inLine.scrollIntoView"
				inLine.scrollIntoView = (inLine.scrollIntoView === false ? false : true);

				/////////////////////////////////////////////////////////////////////////
				/////////////////////////////////////////////////////////////////////////

				controller.searchInfo = {
					'valuesToFind': valuesToFind,
					'opts': opts
				};

				var selectAndRemoveRendered = function(record, preventSelectionChange, scrollIntoView) {
					controller.element.api.selectRow(record, preventSelectionChange, scrollIntoView);
					var rowElement = controller.element.api.resolveRowElement(record);
					rowElement.attr('rendered', false);
				};

				//remove all selections
				controller.element.api.clearSelections();
				if (Array.isArray(recordsFound)) {
					//multiSelect
					if (controller.options.multiSelect) {
						for (let index = 0 ; index < recordsFound.length ; index++) {
							selectAndRemoveRendered(recordsFound[index], index !== 0, index === 0);
						}
					//singleSelect
					} else {
						if (recordsFound.length > 1) {
							console.warn('"find": More than one record was returned, but as the "inLine" property is true and "multiSelect" is false, just the first record will be selected.');
						}
						selectAndRemoveRendered(recordsFound[0], false, true);
					}
				} else {
					if (recordsFound !== null) {
						selectAndRemoveRendered(recordsFound, false, true);
					}
				}


				_repaint(controller);
			}
			/////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////


			if (all) {
		 		return recordsFound;
		 	} else {
		 		return recordsFound[0];
		 	}
		};

		/**
		 *
		 *
		 */
		 /*
		 var _changeFilterInfo = function(filterInfo, valuesToFilter) {
		 	let keys = Object.keys(valuesToFilter);
		 	angular.forEach(keys, function(key) {
				filterInfo.valuesToFilter[key] = valuesToFilter[key];
		 	});
		 	filterInfo.allFields = false;
		 };
		 */

		/**
		 *
		 *
		 */
		me.filter = function(controller, filterModel, opts) {
			if (angular.isString(filterModel)) {
				controller.options.filter.model = angular.merge(controller.options.filter.model, {
					'*': {
						key: filterModel,
						oper: '~',
						value: filterModel
					}
				});
			} else {
				controller.options.filter.model = filterModel;
			}

			//always set to first page
			if (controller.options.paging) {
				controller.options.paging.currentPage = 1;
			}

			//remote filter
			if (controller.options.filter && controller.options.filter.remote) {
				controller.element.api.reload();

			//local filter
			} else {
				controller.element.api.loadData(controller.options.alldata);
			}
		};

		/**
		 *
		 *
		 */
		me.getRowHeight = function(controller) {
			return controller.options.rowHeight;
		};

		/**
		 *
		 *
		 */
		me.setRowHeight = function(controller, rowHeight) {
			var rowElements = controller.bodyViewport.find('div.ui-row:not(.grouping-footer-container)');
			rowElements.css('height', controller.options.rowHeight);
		};


		/**
		 *
		 *
		 */
		var _recreateAll = function(controller) {
			if (controller.options.data) {
				//Remmove all rows before load
				controller.bodyViewport.find('div.ui-deni-view-group-header').remove();
				controller.bodyViewport.find('div.ui-row').remove();

				me.loadData(controller, controller.options.data);
			}
		};

		/**
		 *
		 *
		 */
		me.toogleGrouping = function(controller) {
			controller.options.enableGrouping = !controller.options.enableGrouping;
			_recreateAll(controller);
		};


		/**
		 *
		 *
		 */
		me.isEnableGrouping = function(controller) {
			return controller.options.enableGrouping;
		};

		/**
		 *
		 *
		 */
		me.isGrouped = function(controller) {
			return controller.isGrouped;
		};

		/**
		 *
		 *
		 */
		me.setEnableGrouping = function(controller) {
			controller.options.enableGrouping = true;
			_recreateAll(controller);
		};

		/**
		 *
		 *
		 */
		me.setDisableGrouping = function(controller) {
			controller.options.enableGrouping = false;
			_recreateAll(controller);
		};

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

			let rowElement = $(document.createElement('div'));
			rowElement.addClass('ui-row');
			rowElement.attr('rowindex', itemToRender.rowIndex.toString());
			rowElement.css('left', '0px');

			let fixedRowElement;
			if (controller.options.fixedCols) {
				fixedRowElement = $(document.createElement('div'));
				fixedRowElement.addClass('ui-row');
				fixedRowElement.attr('rowindex', itemToRender.rowIndex.toString());
				fixedRowElement.css('left', '0px');
				controller.fixedColsBodyContainer.append(fixedRowElement);
			}

			//ROW DETAIL
			if (itemToRender.rowDetails) {
				let rowElementParent = controller.bodyContainer.find('.ui-row[rowIndex=' + itemToRender.rowIndex + ']:not(.row-detail-container)');
				rowElement.insertAfter(rowElementParent);

				let isSelected = rowElementParent.find('.ui-cell:eq(0)').is('.selected');
				if (isSelected) {
					rowElement.addClass('selected');
				}
				rowElement.addClass('row-detail-container');

				let rowDetailsBox = $(document.createElement('div'));
				rowDetailsBox.addClass('row-detail-box');
				rowElement.append(rowDetailsBox);

				rowElementParent = controller.element.api.resolveRowElement(itemToRender.rowIndex);

				rowElement.css('height', itemToRender.height + 'px');
				rowElement.css('top', itemToRender.top + 'px');
				rowElement.insertAfter(rowElementParent);

				rowElement.click(function() {
					controller.element.api.selectRow(rowElementParent);
				});

				itemToRender.rowElement = rowElement;


				if (controller.options.rowDetails.template) {
					let valueToRender = uiDeniGridHelperService.applyTemplateValues(controller.options.rowDetails.template, record);
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

						if (itemToRender.expanded) {
							rowElement.addClass('collapse');
						} else {
							rowElement.addClass('expand');
						}

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
							if (itemToRender.indexInsideGroup % 2 === 1) {
								rowElement.addClass('odd-row');
							}
						}

					// common row
					} else {
						/*
						if (controller.options.rowDetails) {
							if (itemToRender.expanded) {
								rowElement.addClass('collapse');
							} else {
								rowElement.addClass('expand');
							}
						}
						*/

						// stripRows (odd line?)
						if (controller.options.stripRows) {
							if (itemToRender.rowIndex % 2 === 1) {
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

			uiDeniGridEventsService.onrenderer(rowElement, fixedRowElement, record, itemToRender, controller);

			///////////////////////////////////////////////
			// onafterrender event
			////////////////////////////////////////////////////////////////
			if (controller.options.listeners.onafterrender) {
				controller.options.listeners.onafterrender(rowElement, controller);
			}
			///////////////////////////////////////////////
			///////////////////////////////////////////////

			////////////////////////////////////////////////////
			//ondblclick event
			////////////////////////////////////////////////////
	    	rowElement.dblclick(function(event) {
	    		var targetEl = $(event.target);
	    		var rowElementDblClick = targetEl.closest('.ui-row');
				var rowIndexDblClick = parseInt(rowElementDblClick.attr('rowindex'));
				var recordDblClick = controller.options.data[rowIndexDblClick];
				if (controller.options.listeners.onrowdblclick) {
					controller.options.listeners.onrowdblclick(recordDblClick, rowElementDblClick, rowIndexDblClick);
				}
			});
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////

			itemToRender.rendered = true;
			return rowElement;
		};

		/**
		 * forceRepaint force repaint all visible rows
		 *
		 */
		me.repaint = function(controller, forceRepaint) {
			_repaint(controller, forceRepaint);
		};

		/**
		 *
		 *
		 */
		me.repaintRow = function(controller, row) {
			var rowIndex = controller.element.api.resolveRowIndex(row);
			_repaintRow(controller, rowIndex, true, true);
		};

		/**
		 *
		 *
		 */
		me.repaintSelectedRow = function(controller) {
			var selectedRowIndex = me.getSelectedRowIndex(controller);
			me.repaintRow(controller, selectedRowIndex);
		};


		/**
		 *
		 *
		 */
		me.getRowIndex = function(controller, record) {
			var data = controller.options.data;
			for (let index = 0 ; index < data.length ; index++) {
				var rec = data[index];
				if (angular.equals(rec, record)) {
					return index;
				}
			}
			return -1;
		};

		/**
		 *
		 *
		 */
		me.removeRow = function(controller, row) {
			var rowIndexToDelete = controller.element.api.resolveRowIndex(row);
			var currentRowIndex = controller.element.api.getSelectedRowIndex();
			var deletingCurrentRow = rowIndexToDelete === currentRowIndex;

			controller.managerRendererItems.removeRow(controller, rowIndexToDelete);
			_repaint(controller);

			// try to restore stat of selelction
			if (controller.options.data.length > 0) {
				if (currentRowIndex !== -1) {
					var rowIndexToSelect = currentRowIndex;
					if (rowIndexToSelect > rowIndexToDelete) {
						rowIndexToSelect--;
					}
					controller.element.api.selectRow(rowIndexToSelect, false, false);
				}
			}
		};

		/**
		 *
		 *
		 */
		me.removeSelectedRows = function(controller) {
			var selectedRowIndexes = me.getSelectedRowIndexes(controller);
			var decreaseRowIndex = 0;
			for (let index = 0 ; index < selectedRowIndexes.length ; index++) {
				var rowIndex = selectedRowIndexes[index];
				me.removeRow(controller, rowIndex - decreaseRowIndex);
				decreaseRowIndex++;
			}
		};

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
		};

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
		};

		me.setEnabled = function(controller, enabled) {
			controller.enabled = enabled;

			if (enabled) {
				controller.element.removeClass('disabled');
			} else {
				controller.element.addClass('disabled');
			}
		};


	}

})();
