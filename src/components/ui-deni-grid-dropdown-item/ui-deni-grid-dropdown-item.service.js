(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownItemModule')
		.service('uiDeniGridDropdownItemService', uiDeniGridDropdownItemService);

	function uiDeniGridDropdownItemService($sce)	{

		var vm = this;

		vm.rendererItem = function(item) {
			var htmlItem = item.template || '<span class="ui-deni-grid-dropdown-item-caption-text">' + item.caption + '</span>';
			return $sce.trustAsHtml(htmlItem);
		};

		vm.filterCheckboxChange = function(checkFilter) {
			//console.log('...sdfsdfdsf---' + checkFilter);
		};

		
	}


})();		
