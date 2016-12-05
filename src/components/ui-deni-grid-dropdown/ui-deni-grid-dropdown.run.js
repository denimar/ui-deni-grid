(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownModule')
		.run(['$templateCache', function($templateCache) {

			/**
			 * template: ui-deni-grid-dropdown.view.html
			 *
			 *
			 */
			$templateCache.put('ui-deni-grid-dropdown.view.html', 
				'<div class="ui-deni-grid-dropdown-container" ng-controller="uiDeniGridDropdownController as ctrl" >\n' +
				'	<ui-deni-grid-dropdown-item ng-repeat="item in ctrl.items" menu-item="item"></ui-deni-grid-dropdown-item>\n' +
				'</div>'
			);

		}]);

})();