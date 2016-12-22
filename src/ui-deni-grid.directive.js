(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.directive('uiDeniGrid', uiDeniGrid);

	function uiDeniGrid($templateCache, uiDeniGridService) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			replace: false,
			bindToController: true,
			controllerAs: 'ctrl',
			controller: 'uiDeniGridController',
			template: $templateCache.get('ui-deni-grid')
		};
	}

})();
