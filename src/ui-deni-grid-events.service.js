/**
 * Put here all internal events
 *
 *
 *
 */

(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.service('uiDeniGridEventsService', uiDeniGridEventsService);

	function uiDeniGridEventsService($compile, uiDeniGridHelperService, uiDeniGridConstant) {
		let vm = this;
		vm.controller = null;

		//Set the controller to the service of the events. Always there'll be one controller to eache uiDeniGridEventsService
		vm.setController = function(controller) {
			vm.controller = controller;
			vm.controller.bodyViewport.scroll(vm.bodyViewportScroll);
		};

		//
		//
		//
		var _createDivCell = function(rowElement) {

			//
			let divCell = $(document.createElement('div'));
			divCell.addClass('ui-cell');
			
			if (vm.controller.options.colLines) {
				divCell.css('border-right', 'solid 1px #e6e6e6');
			}

			if (vm.controller.options.rowLines) {
				divCell.css('border-bottom', 'solid 1px #e6e6e6');
			}
			
			if (!rowElement.is('.row-detail')) {
				///////////////////////////////////''
				//Set the events here
				///////////////////////////////////
				//mouseenter
		    	divCell.mouseenter(function(event) {
					if (!vm.controller.enabled) {
						return;
					}

		    		//selType = 'row'
		    		if (vm.controller.options.selType === 'row') {
		        		//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
						//
					 	vm.controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('hover');
					 	//
					 	vm.controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('hover');

		        	//selType = 'cell'
		        	} else {
		        		$(event.currentTarget).addClass('hover');
		        	}

		    	});

				//mouseleave
		    	divCell.mouseleave(function(event) {
					if (!vm.controller.enabled) {
						return;
					}

		    		//$(event.currentTarget).parent().find('.ui-cell').removeClass('hover');
					//
				 	vm.controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover');
				 	//
				 	vm.controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover');

		    	});

		    	//mousedown
		    	divCell.mousedown(function(event) {
					if (!vm.controller.enabled) {
						return;
					}

		    		if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)

		    			//selType = 'row'
		    			if (vm.controller.options.selType === 'row') {
		    				let divCell = $(event.currentTarget);
							let rowElement = divCell.closest('.ui-row');
							let rowIndex = parseInt(rowElement.attr('rowindex'));

							if (rowIndex !== vm.controller.element.api.getSelectedRowIndex()) {
								vm.controller.element.api.selectRow(rowIndex);
							}	

						//selType = 'cell'
						} else {
							//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
							let divCell = $(event.currentTarget);
							let colIndex = parseInt(divCell.attr('colIndex'));
							let rowElement = divCell.closest('.ui-row');
							let rowIndex = parseInt(rowElement.attr('rowindex'));

							vm.controller.element.api.selectCell(rowIndex, colIndex);
						}

					}
		    	});

				//doubleclick
		    	divCell.dblclick(function(event) {
		    		let targetEl = $(event.target);
		    		if (targetEl.is('.ui-cell-inner')) {
			    		let divCell = $(event.currentTarget);
			    		let colIndex = parseInt(divCell.attr('colIndex'));
						let columns = uiDeniGridHelperService.getColumns(vm.controller, vm.controller.options.columns);
						let column = columns[colIndex];

						if (column.editor) {
							let rowElement = divCell.closest('.ui-row');
							let rowIndex = parseInt(rowElement.attr('rowindex'));
							let record = vm.controller.options.data[rowIndex];
							uiDeniGridHelperService.setInputEditorDivCell(vm.controller, record, column, divCell);
						}
					}	
		    	});

				///////////////////////////////////
				///////////////////////////////////
			}

			rowElement.append(divCell);

			return divCell;
		};

		//
		//
		//
		var _createDivCellInner = function(divCellParent) {
			var spanCellInner = $(document.createElement('span'));
			spanCellInner.addClass('ui-cell-inner');

			divCellParent.append(spanCellInner);

			return spanCellInner;
		};

		//
		//
		var _rendererRealcedCells = function(column, allFields, completeValue, valueToRealce, realceStyle) {
			if ((completeValue) && (valueToRealce)) {
				
				let tryToRealce = false;
				let valueToRealceObj = null;

				if (allFields) {
					tryToRealce = true;					
					valueToRealceObj = valueToRealce['*'];
				} else {
					let fieldName = (column.filter && column.filter.field) ? column.filter.field : column.name;
					valueToRealceObj = valueToRealce[fieldName];
					tryToRealce = angular.isDefined(valueToRealceObj);
				}

				if (tryToRealce) {
					//enter here when there is a multiselect filter
					if (angular.isArray(valueToRealceObj)) {
						let realcedReturn = completeValue;
						angular.forEach(valueToRealceObj, function(valueToRealceObjItem) {
							let valueToRealceNew = {};
							valueToRealceNew[column.name] = valueToRealceObjItem;
							realcedReturn = _rendererRealcedCells(column, allFields, realcedReturn, valueToRealceNew, realceStyle);
						});
						return realcedReturn;
					} else {
						let _getTemplateRealce = function(realcedText) {
							return '<span style="' + realceStyle + '">' + realcedText + '</span>';	
						};
						let pickedValueToRealce = valueToRealceObj.value;

						if (valueToRealceObj.oper === '=') {
							return _getTemplateRealce(completeValue);

						} else if (valueToRealceObj.oper === '<=') {
							return _getTemplateRealce(completeValue);

						} else if (valueToRealceObj.oper === '>=') {
							
						} else {
							completeValue = completeValue.toString();
							let pos = completeValue.search(new RegExp(pickedValueToRealce, 'i'));
							if (pos !== -1) {		
								let newValue = '';
								let initPos = 0;
								while (pos !== -1) {
									newValue += completeValue.substring(initPos, pos);
									newValue += _getTemplateRealce(completeValue.substring(pos, pos + pickedValueToRealce.length));
									initPos = pos + pickedValueToRealce.length;
									
									pos = completeValue.toLowerCase().indexOf(pickedValueToRealce.toLowerCase(), initPos);
								}
								newValue += completeValue.substring(initPos, completeValue.length);
								return newValue;
							}	
						}	
					}	
				}
			}	
			return completeValue;
		};

		//
		//
		vm.onrenderer = function(rowElement, fixedRowElement, record, itemToRender, viewController) {

			/*
			// Card View
			if (angular.isDefined(controller.options.cardView)) {
				//
				var divCell = _createDivCell(controller, rowElement);
				rowElement.css('width', '100%');
				divCell.css('width', '100%');
				valueToRender = uiDeniGridHelperService.applyTemplateValues(getTemplateCardView, record);
				divCell.html(valueToRender);
			*/

			// Row Template
			if (angular.isDefined(vm.controller.options.rowTemplate)) {
				//
				let divCell = _createDivCell(rowElement);
				rowElement.css('width', '100%');
				divCell.css('width', '100%');
				let valueToRender = uiDeniGridHelperService.applyTemplateValues(vm.controller.options.rowTemplate, record);
				divCell.html(valueToRender);

			//Row Detail - Grouping or other type of row details
			} else if (rowElement.is('.row-detail')) {
				//uiDeniGridHelperService.renderCommonRow(vm.controller, rowElement, record, itemToRender.rowIndex);

				//
				let divCell = _createDivCell(rowElement);
				divCell.addClass('row-detail');

				//
				let spanCellInner = _createDivCellInner(divCell);
				spanCellInner.addClass('row-detail');
				if (itemToRender.expanded) {
					spanCellInner.addClass('collapse');
				} else {
					spanCellInner.addClass('expand');
				}	
				spanCellInner.css('cursor', 'pointer');

				spanCellInner.click(function(event) {
				 	//if (event.offsetX <= 12) { //:before pseudo element width
				 		spanCellInner.toggleClass('expand collapse');
				 		rowElement.toggleClass('expand collapse');

				 		if (spanCellInner.is('.collapse')) {
				 			uiDeniGridHelperService.groupExpand(vm.controller, rowElement, record, itemToRender.rowIndex);
				 		} else {
				 			uiDeniGridHelperService.groupCollapse(vm.controller, rowElement, record, itemToRender.rowIndex);
				 		}
				 	//}
				});

				let valueToRender;
				if (vm.controller.options.grouping.template) {
					let totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
					valueToRender = uiDeniGridHelperService.applyTemplateValues(vm.controller.options.grouping.template, record, {count: totalRowsInGroup});
				}

				spanCellInner.html(valueToRender);

			// Grouping Footer
			} else if (rowElement.is('.ui-grouping-footer-container')) {
				let columns = vm.controller.options.columns;
				let totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
				let records = vm.controller.options.data.slice(itemToRender.rowIndex, itemToRender.rowIndex + totalRowsInGroup);

				//
				uiDeniGridHelperService.createColumnFooters(vm.controller, rowElement, columns, false);
				//
				uiDeniGridHelperService.renderColumnFooters(vm.controller, rowElement, columns, records, false);

			// (Common Row)
			} else {
				//rowElement.css('width', '100%');

				let isRowSelected = rowElement.is('.selected');
				let columns = uiDeniGridHelperService.getColumns(vm.controller, vm.controller.options.columns);
				let colIndex = 0;
				for (let index = 0 ; index < columns.length ; index++) {

					//
					if (index === 0) {
						//if Fixed Columns
						if (vm.controller.options.fixedCols) {

							//if has checkbox
							if (vm.controller.options.fixedCols.checkbox) {
								let divCellIndicator = _createDivCell(fixedRowElement);
								divCellIndicator.css('width', uiDeniGridConstant.FIXED_COL_CHECKBOX_WIDTH);
								divCellIndicator.addClass('auxiliar-fixed-column');
								let spanCellIndicatorInner = _createDivCellInner(divCellIndicator);
								spanCellIndicatorInner.addClass('checkbox');
								let inputCheck = $(document.createElement('input'));
								inputCheck.attr('type', 'checkbox');
								inputCheck.css({
									cursor: 'pointer'
								});
								spanCellIndicatorInner.append(inputCheck);
								colIndex++;
							}

							//if has indicator
							if (vm.controller.options.fixedCols.indicator) {
								let divCellIndicator = _createDivCell(fixedRowElement);
								divCellIndicator.css('width', uiDeniGridConstant.FIXED_COL_INDICATOR_WIDTH);
								divCellIndicator.addClass('auxiliar-fixed-column');
								let spanCellIndicatorInner = _createDivCellInner(divCellIndicator);
								spanCellIndicatorInner.addClass('indicator');
								colIndex++;
							}

							//if has row number
							if (vm.controller.options.fixedCols.rowNumber) {
								let divCellRowNumber = _createDivCell(fixedRowElement);
								divCellRowNumber.css('width', uiDeniGridConstant.FIXED_COL_ROWNUMBER_WIDTH);
								divCellRowNumber.addClass('auxiliar-fixed-column');
								let spanCellRowNumberInner = _createDivCellInner(divCellRowNumber);
								spanCellRowNumberInner.addClass('rownumber');
								spanCellRowNumberInner.html(itemToRender.rowIndex + 1);
								colIndex++;
							}
						}
					}

					//
					let column = columns[index];


					//
					let divCell;

					//if fixed column?
					if (uiDeniGridHelperService.isFixedColumn(vm.controller, column.name)) {
						divCell = _createDivCell(fixedRowElement);
					} else {
						divCell = _createDivCell(rowElement);
					}
					divCell.attr('colIndex', colIndex);

					//
					let spanCellInner = _createDivCellInner(divCell);

					//action column
					if (column.action) {
						spanCellInner.css('text-align', 'center');						
						spanCellInner.addClass('ui-cell-inner-action');

						let iconActionColumn = column.action.mdIcon || column.action.icon;
						if (angular.isFunction(iconActionColumn)) {
							iconActionColumn = iconActionColumn(record);
						}	
						let imgActionColumn;					
						if (column.action.mdIcon) { //Usa o md-icon do Angular Material
							let imgActionColumnBtn = $(document.createElement('md-button'));
							
							if (column.action.tooltip) {							
								let imgActionColumnBtnTooltip = $(document.createElement('md-tooltip'));
								let textTooltip;

								if (angular.isFunction(column.action.tooltip)) {
									textTooltip = column.action.tooltip(record);
								} else {
									textTooltip = column.action.tooltip;
								}	
								imgActionColumnBtnTooltip.html(textTooltip);
								imgActionColumnBtn.append(imgActionColumnBtnTooltip);
							}	
						
							imgActionColumn = $(document.createElement('md-icon'));
							imgActionColumn.addClass('material-icons');
							imgActionColumn.html(iconActionColumn);
							imgActionColumnBtn.append(imgActionColumn);														
							
							let imgActionColumnBtnCompiled = $compile(imgActionColumnBtn) (vm.controller.scope);
							spanCellInner.append(imgActionColumnBtn);							
							imgActionColumnBtn.find('md-icon').prop('column', column);							

							imgActionColumnBtn.click(function(event) {
								let imgAction = $(event.currentTarget).find('md-icon');
								let colAction = imgAction.prop('column');
								colAction.action.fn(record, column, imgAction);
							});


						} else {
							imgActionColumn = $(document.createElement('img'));
							imgActionColumn.attr('src', iconActionColumn);
							imgActionColumn.attr('title', column.action.tooltip);
							spanCellInner.append(imgActionColumn);
							imgActionColumn.prop('column', column);							

							imgActionColumn.click(function(event) {
								let imgAction = $(event.currentTarget);
								let colAction = imgAction.prop('column');
								colAction.action.fn(record, column, imgActionColumn);
							});

							imgActionColumn.css('cursor', 'pointer');
						}	

					} else {

						//
						if (index === 0) {
							//
							//rowDetails Property
							if (vm.controller.options.rowDetails) {
								spanCellInner.addClass('row-detail');

								if ((itemToRender.expanded) || (vm.controller.options.rowDetails.autoExpand === true)) {
									spanCellInner.addClass('collapse');
								} else {
									spanCellInner.addClass('expand');
								}

								spanCellInner.click(function(event) {
								 	if (event.offsetX <= 12) { //:before pseudo element width
								 		var target = $(event.target);

								 		if (target.is('.collapse')) {
								 			uiDeniGridHelperService.rowDetailsCollapse(vm.controller, rowElement, record, itemToRender.rowIndex);
								 		} else {
								 			uiDeniGridHelperService.rowDetailsExpand(vm.controller, rowElement, record, itemToRender.rowIndex);
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
						if ((index === 0) && (vm.controller.element.api.isGrouped())) {
							divCell.css('padding-left', '20px');
						}

						var value = null;
						try {
							value = eval('record.' + column.name); //value = record[column.name];
						} catch (err) {
						}

						//Is there a specific render for this field?
						if (column.renderer) {
							value = column.renderer(value, record, columns, itemToRender.rowIndex);
						}

						var formattedValue = value;
						if (angular.isDefined(column.format)) {
							formattedValue = uiDeniGridHelperService.getFormatedValue(value, column.format);
						}

						var rendererRealcedCellsFn = function(valuesToField, allFields, realceStyle) {
							return _rendererRealcedCells(column, allFields, formattedValue, valuesToField, realceStyle);
						};

						//Is there something to realce (Used in Searches and Filters)
						if (vm.controller.searchInfo) {
							if (isRowSelected) {
								//TODO: test this block
								formattedValue = rendererRealcedCellsFn(vm.controller.searchInfo.valuesToFilter, vm.controller.options.filter.allFields, vm.controller.searchInfo.opts.inLine.realce);
							}	
						} else if (column.filter) {							
							formattedValue = rendererRealcedCellsFn(vm.controller.options.filter.model, vm.controller.options.filter.allFields, vm.controller.options.filter.realce);
						}

						//
						spanCellInner.html(formattedValue);
					}	

					//realPercentageWidth cause effect only when there are more then one level of columns
					divCell.css('width', column.realPercentageWidth || column.width);					

					//
					colIndex++;
				}

			}
		};

		/* ---- WARNING ---- TODO: try to implement use this event
		vm.onafterexpand = function(records, options, elementGroupRow, lastInsertedDivRow) {
			if (records.length > 0) {
				let rowIndex = vm.controller.element.api.resolveRowIndex(records[0]);
				me.selectRow(vm.controller, rowIndex);
			}

			//Are there footer?
			if (uiDeniGridHelperService.hasColumnFooter(vm.controller)) {

				let footerDivContainer = elementGroupRow.prop('footer');
				if (angular.isDefined(footerDivContainer)) {
					footerDivContainer.css('display', 'block');
				} else {
					//Create a div container to insert the footer of the grouping
					footerDivContainer = $(document.createElement('div'));
					footerDivContainer.addClass('ui-deni-grid-grouping-footer-container');

					//Used to collapse
					elementGroupRow.prop('footer', footerDivContainer);

					footerDivContainer.insertAfter(lastInsertedDivRow);

					uiDeniGridHelperService.renderColumnFooters(footerDivContainer, vm.controller.footerContainer, vm.controller.options.columns, records, vm.controller);
				}
			}
		};
		*/

		vm.onafterrepaint = function(viewController) {
			/*
			vm.controller.clientWidth;

			var columns = uiDeniGridHelperService.getColumns(vm.controller, vm.controller.options.columns);
			//Any column was specified in percentage? TODO: create a function to get this
			var anyColumnInPercentage = false;
			for (var colIndex = 0 ; colIndex < vm.controller.options.columns.length ; colIndex++) {
				if (vm.controller.options.columns[colIndex].width.toString().indexOf('%') != -1) {
					anyColumnInPercentage = true;
					break;
				}
			}
			*/

			
			uiDeniGridHelperService.adjustAllColumnWidtsAccordingColumnHeader(vm.controller);
        };
        
        vm.bodyViewportScroll = function(event) {
		    let currentLeft = $(this).scrollLeft();

		    //Vertical Scroll
		    if(vm.controller.bodyViewport.currentScrollLeft === currentLeft) {
		    	vm.controller.bodyViewport.currentScrollTop = $(this).scrollTop();

		        let firstViewRow = vm.controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	let boundingClientTop = firstViewRow.get(0).getBoundingClientRect().top;

		        	//
		        	let top = (vm.controller.bodyViewport.currentScrollTop * -1) + 'px';

		        	//
					if (vm.controller.options.fixedCols) {
		        		vm.controller.fixedColsBodyContainer.css('top', top);
		        	}
		        	//
					//vm.controller.footerDivContainer.find('.ui-deni-grid-footer').css('top', top);
					//vm.controller.footerDivContainer.css('left', left);
		        }

		    }
		    //Horizontal Scroll
		    else {
		    	vm.controller.bodyViewport.currentScrollLeft = currentLeft;

		        let firstViewRow = vm.controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	let boundingClientLeft = firstViewRow.get(0).getBoundingClientRect().left;

		        	//
		        	let left = (vm.controller.bodyViewport.currentScrollLeft * -1) + 'px';

		        	//
		        	vm.controller.headerContainer.css('left', left);
		        	
					//Are there footer?
					if (uiDeniGridHelperService.hasColumnFooter(vm.controller)) {
			        	//
						vm.controller.footerDivContainer.find('.ui-deni-grid-footer').css('left', left);
						//vm.controller.footerDivContainer.css('left', left);
					}	
		        }
		    }

		    //
			vm.controller.element.api.repaint();
        };		

        /*
        //
        vm.controller.bodyViewport.scroll(function(event) {
		    let currentLeft = $(this).scrollLeft();

		    //Vertical Scroll
		    if(controller.bodyViewport.currentScrollLeft === currentLeft) {
		    	controller.bodyViewport.currentScrollTop = $(this).scrollTop();

		        let firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	let boundingClientTop = firstViewRow.get(0).getBoundingClientRect().top;

		        	//
		        	let top = (controller.bodyViewport.currentScrollTop * -1) + 'px';

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

		        let firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	let boundingClientLeft = firstViewRow.get(0).getBoundingClientRect().left;

		        	//
		        	let left = (controller.bodyViewport.currentScrollLeft * -1) + 'px';

		        	//
		        	controller.headerContainer.css('left', left);
		        	
					//Are there footer?
					if (uiDeniGridHelperService.hasColumnFooter(controller)) {
			        	//
						controller.footerDivContainer.find('.ui-deni-grid-footer').css('left', left);
						//controller.footerDivContainer.css('left', left);
					}	
		        }
		    }

		    //
			controller.element.api.repaint();
        });		
        */


	} //end service

})();