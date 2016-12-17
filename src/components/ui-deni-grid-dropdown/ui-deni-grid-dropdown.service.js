(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownModule')
		.service('uiDeniGridDropdownService', uiDeniGridDropdownService);

	function uiDeniGridDropdownService($templateCache, $compile, $timeout, $interval, $q, $filter) {

		var vm = this;
		vm.scope = null;
		vm.controller = null;
		vm.callbackFunction = null;
		vm.sortable = false;
		vm.containerElm = null; //element itself
		vm.column = null; //column inside which is going to put the dropdown menu

		//never will be more than one controller using the same service
		vm.setController = function(controller) {
			vm.controller = controller;
		};

		var _documentMousedown = function() {
			let elemTarget = $(event.target);
			let container = elemTarget.closest('.ui-deni-grid-dropdown-container');

			//
			if (container.length === 0) {
				vm.close(null, false);
			}
		};

		var _execFilter = function() {
			vm.close(null, true);
		};

		var _updateValuesFromFilterModel = function() {
			var fieldToFilter = vm.column.filter.field || vm.column.name;
			var fieldValue = vm.scope.filterModel[fieldToFilter];
			
			if (fieldValue) {
				//integer
				if (vm.column.filter.type === 'integer') {
					let inputs = vm.containerElm.find('input[type=number]');
					let inputLessThan = inputs.get(0);
					let inputGreaterThan = inputs.get(1);
					let inputEquals = inputs.get(2);
					
					angular.forEach(fieldValue, function(filterValueInt) {
						if (filterValueInt.oper === '<=') {
							inputLessThan.value = filterValueInt.key;	
						} else if (filterValueInt.oper === '>=') {
							inputGreaterThan.value = filterValueInt.key;	
						} else if (filterValueInt.oper === '=') {
							inputEquals.value = filterValueInt.key;	
						}
					});

				//float
				} else if (vm.column.filter.type === 'float') {
					//TODO: missing implementation

				//string	
				} else if (vm.column.filter.type === 'string') {
					let input = vm.containerElm.find('input[type=text]');
					input.val(fieldValue.key);

				//date	
				} else if (vm.column.filter.type === 'date') {
					//TODO: missing implementation

				//date and time	
				} else if (vm.column.filter.type === 'datetime') {
					let inputs = vm.containerElm.find('input');
					let inputLessThan = inputs.get(0);
					let inputGreaterThan = inputs.get(1);
					
					angular.forEach(fieldValue, function(filterValueDatetime) {
						//let dateObj = new Date(filterValueDatetime.key);
						//let formattedDate = $filter('date')(dateObj, 'yyyy-MM-ddTHH:mm');

						if (filterValueDatetime.oper === '<=') {
							inputLessThan.value = filterValueDatetime.key;	
						} else if (filterValueDatetime.oper === '>=') {
							inputGreaterThan.value = filterValueDatetime.key;	
						}
					});

				//boolean	
				} else if (vm.column.filter.type === 'boolean') {
					//TODO: missing implementation

				//select (radio)	
				} else if (vm.column.filter.type === 'select') {

						var radiobox = vm.containerElm.find('input[type=radio][value=' + fieldValue.key + ']');
						if (radiobox.length > 0) {
							radiobox.prop('checked', true);
						}
					
				//multi select (checkbox)	
				} else if (vm.column.filter.type === 'multiSelect') {
					angular.forEach(fieldValue, function(valueToSet) {
						var checkbox = vm.containerElm.find('input[type=checkbox][value=' + valueToSet.key + ']');
						if (checkbox.length > 0) {
							checkbox.prop('checked', true);
						}
					});

					//
				} else {
					throw new Error('Filter type invalid!');
				}	

			}
		};

		var _whenVisible = function(element, selector) {
			let deferred = $q.defer();
			let numberOfAttempts = 0;
			let maxAttempts = 10;			
			let interval = 50;

			let intervalPromise = $interval(function() {
				let elem = selector ? element.find(selector) : element;

				if (elem.length > 0) {
					$interval.cancel(intervalPromise);
					deferred.resolve(elem);
				}

				numberOfAttempts++;
				if (numberOfAttempts > maxAttempts) {
					deferred.reject('time out!');
					$interval.cancel(intervalPromise);
				}

			}, interval);

			return deferred.promise;
		};

		var _getTemplateFilterDropdownMenuItemByFileName = function(controller, templateFileName, items) {
			var deferred = $q.defer();
			var html = $templateCache.get(templateFileName);

			if (angular.isUndefined(html)) {
				console.log('Template not found "' + templateFileName + '"');
			}

			controller.scope.filterModel = controller.options.filter.model;

			let template = angular.element(html);
			let linkFn = $compile(template);
			let elem = linkFn(controller.scope); 

			controller.scope.items = items;

			_whenVisible(elem)
				.then(function() {
					deferred.resolve(elem.get(0).outerHTML);
				});

			return deferred.promise;			
		};	
	

		var _getTemplateFilterDropdownMenuItem = function(controller, filter, column) {
			//integer
			if (filter.type === 'integer') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'integer-filter.template.html');

			//float
			} else if (filter.type === 'float') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'float-filter.template.html');

			//string	
			} else if (filter.type === 'string') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'string-filter.template.html');

			//date	
			} else if (filter.type === 'date') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'date-filter.template.html');

			//date and time	
			} else if (filter.type === 'datetime') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'datetime-filter.template.html');

			//boolean	
			} else if (filter.type === 'boolean') {
				//

			//select (radio)	
			} else if (filter.type === 'select') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'select-filter.template.html', filter.items);

			//multi select (checkbox)	
			} else if (filter.type === 'multiSelect') {
				return _getTemplateFilterDropdownMenuItemByFileName(controller, 'multiselect-filter.template.html', filter.items);
			}

			throw new Error('Filter type invalid!');
		};

		let _checkRightPosition = function() {
			//Check Right Position
			let containerElmRightPos = vm.containerElm.offset().left + vm.containerElm.width();
			let screenRightPos = window.innerWidth;
			if (containerElmRightPos > screenRightPos) {
				let marginRight = 35;
				vm.containerElm.css('left', (screenRightPos - vm.containerElm.width() - marginRight) + '.px');
			}
		};

		let _checkBottomPosition = function(targetEl) {
			//Check Bottom Position
			let containerElmBottomPos = vm.containerElm.offset().top + vm.containerElm.height();
			let screenBottomPos = window.innerHeight;
			if (containerElmBottomPos > screenBottomPos) {
				vm.containerElm.css('top', (targetEl.offset().top - vm.containerElm.height()) + '.px');
			}
		};

		let _loadDropdownItems = function(parentController, sortable, column, targetEl)  {
			vm.controller.items = [];
			let checkPosition = function() {
				_checkRightPosition();
				_checkBottomPosition(targetEl);			
			};

			if (sortable && (column.sortable !== false)) {
				vm.controller.items.push({
					name: 'mniSortAsc',
					caption: 'Sort Ascending',
					icon: 'data:image/gif;base64,R0lGODlhEAAQAPcAAAAAACkxOTE5SnM5KUJSY1Jje1prezFSlDFalDlalEprlEJrtUprtVJ7rVJzvVp7vVJzxlJ7xnuMpXOMtXOUvXuUtWOExnuU1oQxIYQ5KZQ5OYxCOZRCQpRKUpRSWpxjY5xja5xzc6Vze5xrhJx7lKV7hKWEnLWEnK2MpbWUrbWcrbWttZSlxpStxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAQABAAAAh+AP8JhCCwYMECBv9dWMAi4T8WACoYjOAggUMBAAIYZPDvQEKIAABMEPjAAYUEDQwakBCRgECOAj0mBFDQAoIW/xIcUDDToU+BNAuaIIGCBAgVPQuWEOhhg8OgBk9gWPHUYYcPPqEKHOE0q8EUHJD+E5FUoIYBIT5kCFH258+AADs=',
					click: function() {
						vm.close({
							name: column.name,
							direction: 'ASC'
						}, false);
					}					
				});

				vm.controller.items.push({
					name: 'mniSortDesc',
					caption: 'Sort Descending',
					icon: 'data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAAD/ACkxOTE5SjFCczFKhDlKezlSe0JSY0JapUpajEpjpVJje1JrnFJzrVpre1pztWN7tWuMvXM5KXOMtXuMpXuUtYQxIYQ5KYxCOYycxpQ5OZRCOZRCQpRKUpRSWpSlxpStxpStzpxjY5xja5xrhJxzc5x7lJy11qVze6V7hKV7lKWEnK2Mpa3G57WEnLWUrbWcrbWttbXG572lrb3G1r3W98bG3s7O3s7e79be9////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAAQABAAAAh/AAOwONHiBIkYARImBKAwgIqEHzI0XDgxwIsLMioynOhhRMUAGxWWkPgxZAAYHRAGSDHR5IYJJkZgMNHyo02TCheUrCghgQaNFR00MNDwQQUAFhA01EmgYQgAUCkohNCAgoEGDQcAELBUYVOFIJAqjFAARAADBBQ0ZGCzbcKAAAA7',
					click: function() {
						vm.close({
							name: column.name,
							direction: 'DESC'
						}, false);
					}					
				});
			}	

			if (column.filter) {
				_getTemplateFilterDropdownMenuItem(parentController, column.filter, column)
					.then(function(templateHtml) {
						//
						vm.controller.items.push({
							name: 'mniFilter',
							caption: 'Filter',
							icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAEZyIDI4IEZlYiAyMDAzIDExOjUxOjUxICswMTAwfOn0bwAAAAd0SU1FB9QHBwgdIKCdDVwAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAACdUlEQVR42o1SvW9ScRS9j0ehNIWAIQEpqTg4mA46yOCATYyb6dLRuLB3cfAf6NKtq38AIXERFhMGhYAmBuoAUWiVgqVA+CwfeYB8FZ7nvjy0X4M3ue+X994953fPuVcgxO7urmZ7e/tZLpd73uv1HoqieEev15vm8zlNp1Op3W6Xj46O0slk8iPOD51OZwDYOWOF09PTB4lEwp9KpTYYsLa2Rg6Hg5xOJ5lMJjKbzcq5srJCICefz5fb399/lc/no8APRKvVGvb7/Ru4lVZXV8lgMCjFRqORlpaWSKvVkiAIxP/5u9vtvtXtdp9Eo9EvIGhpUHTW7/cJbZEkSTQcDrlt4m4YyAQ6nY4giRYBGWc4HiHNmnK5/HpnZ6e9vr5O0Eq1Wo0Gg4FSyB1ZLBalGyYNBoO0tbXVCgQC3/B7ipwLeBi8Xu/Lvb29NygS0+k0NRoNms1mNJlMFNJCoUDNZpNGo9E5/HqLb0Xg3iNTIh4zGHgCgB7sj202G8EXstvtiu4LsuRMJvMOHTeBCSO5i76oyhrH4/Hv0Hp/c3PzHnuC26jValGpVKJ6vU7Hx8cRjLGO2k/IAyT7IC8IZOSwWCymlpeXn3o8Hiv7wH4ASBjZYSwW+ynL8oFKUOHOGSjSv5hjElK1Ws1CzgtMQchmswyehEKhMCQcqq0XVAOV0NDlGKPNz5jI1OVyKTsBIyXI6eNfAnnCNRcBVwlYCs9wxCaq4/uNd0lte3Cl/hqBQlKpVMI8AfhB4/F4qN46vaH2kgd/A8Z9jUQiVszbgq37gb3Iq2PrXq0V6Obgvb2rrutt5C9kTB3dfxEsSEy8qTxi9fZrMv4ACcVMYmdxl5oAAAAASUVORK5CYII=',
							separator: vm.controller.items.length > 0,
							template: templateHtml
						});

						$timeout(function() {
							//
							checkPosition();

							//
							_updateValuesFromFilterModel();
						});	
					});
			}

			$timeout(function() {
				//
				checkPosition();		
			});	
		};

		vm.open = function(parentController, sortable, column, mousePoint, callbackFunction) {
			vm.scope = parentController.scope;
			vm.column = column;
			vm.callbackFunction = callbackFunction;
			vm.sortable = sortable;

			let targetEl = $(event.target);
			let mousePointOpen = mousePoint || {
				y: event.clientY,
				x: event.clientX								
			};
			let html = $templateCache.get('ui-deni-grid-dropdown.view.html');
			vm.containerElm = angular.element(html);
			let bodyElm = $(document.body);

			vm.containerElm.css({
				top: mousePointOpen.y,
				left: mousePointOpen.x,
				visibility: 'hidden'
			});

			bodyElm.append(vm.containerElm);
			$compile(vm.containerElm)(vm.scope);

			//
			vm.containerElm.css('visibility', 'visible');

			//
			_loadDropdownItems(parentController, sortable, column, targetEl);							

			if (column.filter) {
				$timeout(function() {
					//
					_whenVisible(vm.containerElm, 'button')
						.then(function(filterButton) {
							filterButton.click(_execFilter);
						});

					let selector;	
					if ((column.filter.type === 'date') || (column.filter.type === 'datetime')) {
						//
						selector = 'input:first';
					} else if ((column.filter.type === 'string') || (column.filter.type === 'integer') || (column.filter.type === 'float')) {
						selector = 'input:last';
					}

					if (angular.isDefined(selector)) {
						_whenVisible(vm.containerElm, selector)
							.then(function(inputs) {
								//ensures that the focus will be set
								var input = inputs.get(0);
								$(input).focus();

								//
								inputs.keydown(vm.inputsKeydown);
							});
					}		

				});
			}	

			$(document).mousedown(_documentMousedown);
		};	

		var _getFilterModelChanged = function(filterModel) {
			var value = {};

			//integer
			if (vm.column.filter.type === 'integer') {
				let inputs = vm.containerElm.find('input[type=number]');
				let inputLessThan = inputs.get(0);
				let inputGreaterThan = inputs.get(1);
				let inputEquals = inputs.get(2);
				value = [];

				//<=
				if (!isNaN(inputLessThan.valueAsNumber)) {
					value.push({
						key: inputLessThan.valueAsNumber,
						value: inputLessThan.valueAsNumber,
						oper: '<='
					});	
				}

				//>=
				if (!isNaN(inputGreaterThan.valueAsNumber)) {
					value.push({
						key: inputGreaterThan.valueAsNumber,
						value: inputGreaterThan.valueAsNumber,
						oper: '>='
					});	
				}

				//=
				if (!isNaN(inputEquals.valueAsNumber)) {
					value.push({
						key: inputEquals.valueAsNumber,
						value: inputEquals.valueAsNumber,
						oper: '='
					});	
				}


			//float
			} else if (vm.column.filter.type === 'float') {
				//TODO: missing implementation

			//string	
			} else if (vm.column.filter.type === 'string') {
				let input = vm.containerElm.find('input[type=text]');
				value = {
					key: input.val(),
					value: input.val(),
					oper: '~'
				};	

			//date	
			} else if (vm.column.filter.type === 'date') {
				//TODO: missing implementation

			//date and time	
			} else if (vm.column.filter.type === 'datetime') {
				let inputs = vm.containerElm.find('input');
				let inputLessThan = inputs.get(0);
				let inputGreaterThan = inputs.get(1);
				value = [];

				//<=
				if (inputLessThan.value) {
					value.push({
						key: inputLessThan.value,
						value: inputLessThan.value,
						oper: '<='
					});	
				}

				//>=
				if (inputGreaterThan.value) {
					value.push({
						key: inputGreaterThan.value,
						value: inputGreaterThan.value,
						oper: '>='
					});	
				}

			//boolean	
			} else if (vm.column.filter.type === 'boolean') {
				//TODO: missing implementation

			//select (radio)	
			} else if (vm.column.filter.type === 'select') {
				let selectRadioButton = vm.containerElm.find('input[type=radio]:checked');
				value = {
					key: selectRadioButton.attr('key'),
					value: selectRadioButton.attr('value'),
					oper: '='
				};


			//multi select (checkbox)	
			} else if (vm.column.filter.type === 'multiSelect') {
				let checkboxes = vm.containerElm.find('input[type=checkbox]:checked');
				value = [];
				//checkboxes.length
				angular.forEach(checkboxes, function(checkbox) {
					value.push({
						key: checkbox.value,
						value: checkbox.nextElementSibling.innerText,
						oper: '='
					});	
				});

				//
			} else {
				throw new Error('Filter type invalid!');
			}	

			var returnObj = {};
			var filterFieldName = vm.column.filter.field || vm.column.name;
			var valueIsArray = angular.isArray(value);
			var valueWasChanged = false;

			if (valueIsArray) {
				valueWasChanged = value.length > 0;
			} else {
				valueWasChanged = angular.isDefined(value.value) && value.value !== null && value.value !== '';
			}

			//
			if (valueWasChanged) {
				returnObj[filterFieldName] = value;
			//
			} else {
				var keysFilter = Object.keys(filterModel);
				if (keysFilter.indexOf(filterFieldName) !== -1) {
					delete filterModel[filterFieldName];
				}
			}	

			return returnObj;
		};

		vm.close = function(execSortObj, execFilter) {
			//
			if ((!execSortObj) && (vm.column.filter)) {
				//does any filter was changed? 
				angular.extend(vm.scope.filterModel, _getFilterModelChanged(vm.scope.filterModel));
			}	

			//
			vm.containerElm.remove();
			$(document).off('mousedown', _documentMousedown);			

			if (vm.callbackFunction) {
				//
				vm.callbackFunction(vm.column, execSortObj, execFilter);
			}
		};

		/*
		//the items must be added before it is showed
		vm.addItem = function(itemConfig) {
			vm.controller.items.push(itemConfig);
		};
		*/

		vm.inputsKeydown = function() {
			if (event.keyCode === 13) {
				_execFilter();
			}
			event.stopPropagation();
		};	

	}


})();		
