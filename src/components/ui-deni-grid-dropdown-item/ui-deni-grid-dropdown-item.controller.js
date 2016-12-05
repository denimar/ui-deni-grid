(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownItemModule')
		.controller('uiDeniGridDropdownItemController', uiDeniGridDropdownItemController);

	function uiDeniGridDropdownItemController(uiDeniGridDropdownItemService)	{

		this.rendererItem = uiDeniGridDropdownItemService.rendererItem;
		this.filterCheckboxChange = uiDeniGridDropdownItemService.filterCheckboxChange;

	}


})();		
