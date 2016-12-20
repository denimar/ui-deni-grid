(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownItemModule')
		.service('uiDeniGridDropdownItemService', uiDeniGridDropdownItemService);

  uiDeniGridDropdownItemService.$inject = ['$sce'];

	function uiDeniGridDropdownItemService($sce)	{

		var vm = this;

		vm.rendererItem = function(scope, item) {
			if ((item.filter) && (item.filter.renderer)) {
				if (scope.ctrl.elementItemCaption.children().length === 0) {
					item.filter.renderer(scope.ctrl.elementItemCaption);
					item.filter.setValuesInputs(scope.ctrl.elementItemCaption, item.filterModel);
				}
				return '';
			} else {
				var htmlItem = item.template || '<span class="ui-deni-grid-dropdown-item-caption-text">' + item.caption + '</span>';
				return $sce.trustAsHtml(htmlItem);
			}
		};

		vm.filterCheckboxChange = function(checkFilter) {
			//console.log('...sdfsdfdsf---' + checkFilter);
		};


	}


})();
