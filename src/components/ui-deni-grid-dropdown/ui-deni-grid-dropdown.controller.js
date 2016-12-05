(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownModule')
		.controller('uiDeniGridDropdownController', uiDeniGridDropdownController);

	function uiDeniGridDropdownController(uiDeniGridDropdownService)	{
		
		this.items = [];

		//never will be more than one controller using the same service
		uiDeniGridDropdownService.setController(this);

		this.keydown = uiDeniGridDropdownService.keydown;
		//this.showDropdownMenu = uiDeniGridDropdownService.showDropdownMenu;
	}


})();		
