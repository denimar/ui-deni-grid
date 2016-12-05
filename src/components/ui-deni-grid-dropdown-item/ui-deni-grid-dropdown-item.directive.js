(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownItemModule')
		.directive('uiDeniGridDropdownItem', uiDeniGridDropdownItem);

	function uiDeniGridDropdownItem($templateCache)	{
		return {
			restrict: 'E',
			scope: {},
			bindToController: {
				menuItem: '='
			},
			controller: 'uiDeniGridDropdownItemController',
			controllerAs: 'ctrl',
			//templateUrl: './src/components/ui-deni-grid-dropdown-item/ui-deni-grid-dropdown-item.view.html'
			template: $templateCache.get('ui-deni-grid-dropdown-item.view.html')
		};
	}


})();		
