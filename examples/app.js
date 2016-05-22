angular.module('myApp', ['app.scripts.deni-modal.mdl']);

angular.module('myApp').controller('MainCtrl', function($scope, deniModalSrv) {

	$scope.examples = [
		{
			text: 'Basic',
			children: [
				{
					text: 'Basic Array Grid',
					img: 'basic-array-grid.gif',
					path: '3nfdckrg',
					description: 'The simplest way to show data using the ui-deni-grid'
				},
				{
					text: 'Binding to XML',
				},
				{
					text: 'Binding to remote XML',
				},
				{
					text: 'Binding to Local JSON',
				},
				{
					text: 'Binding to remote JSON',
				},
			],
		},
		{
			text: 'Fixed Columns',
			children: [
				{
					text: 'Checkbox',
					img: 'basic-array-grid.gif',
					path: 'gv3sgjpy',
					description: 'This example show how put a checkbox as a fixed column'
				},
				{
					text: 'Fixed Columns',
					img: 'basic-array-grid.gif',
					path: 'mousxpr5',
					description: 'A way to scroll the data fixing one or more columns'
				},
				{
					text: 'Indicator',
					img: 'basic-array-grid.gif',
					path: 'v5p3s45x',
					description: 'Showing a indicator at the left side of the grid'
				},
				{
					text: 'Row Number',
					img: 'basic-array-grid.gif',
					path: '4s22s15b',
					description: 'Sometime there is a need to know what line we are'
				},
			]
		},	
		{
			text: 'Templates',
			children: [
				{
					text: 'Row Template 1',
					img: 'basic-array-grid.gif',
					path: 'z075e6d0',
					description: '????????'
				},
				{
					text: 'Row Template 2',
					img: 'basic-array-grid.gif',
					path: '0hhue7rk',
					description: '????????'
				},
				{
					text: 'Footer Template',
					img: 'basic-array-grid.gif',
					path: 'ysp0vdmh',
					description: '????????'
				},
				{
					text: 'Footer Row Template',
					img: 'basic-array-grid.gif',
					path: 'dervvL56',
					description: '????????'
				},
			]
		},		
		{
			text: 'Grouping',
			children: [
				{
					text: 'Grouping',
					img: 'grouping-grouping.gif',
					path: 's9n0x5b7',
					description: 'The simplest way to grouping data using the ui-deni-grid'
				},
				{
					text: 'Grouping with Footer',
					img: 'grouping-grouping.gif',
					path: 'sywnb63x',
					description: 'Showing a footer like a sumary at the end of the grouping, plus, as you can see, the footer is showing at the end of the grid too, exactly like was configured. For more details see the "footer" section.'
				}
			]
		},
		{
			text: 'Selection',
			children: [
				{
					text: 'Row Selection',
				},
				{
					text: 'Cell Selection',
				},
				{
					text: 'CheckBox Selection',
				},
			]
		},
		{
			text: 'Sorting',
			children: [
				{
					text: 'Sorting',
				},
				{
					text: 'Multiple Sorting',
				},
				{
					text: 'Fixed Sorting',
				},
			]
		},
		{
			text: 'Editing',
			children: [
				{
					text: 'Cell Editing',
				},
			]
		},
		{
			text: 'Filtering',
			children: [
				{
					text: 'Local Row Filter'
				},
				{
					text: 'Remote Row Filter'
				}
			]		
		},
		{
			text: 'Drag and Drop',
		},
		{	
			text: 'Footer',
			children: [
				{
					text: 'Custom Functions',
					path: 'footer/custom-functions'
				},
				{
					text: 'Custom Renderer',
					path: 'footer/custom-renderer'
				},
				{
					text: 'Default Functions',
					path: 'footer/default-functions'
				},
				{
					text: 'Row Template',
					path: 'footer/footer-row-template'
				},
				{
					text: 'Footer Template',
					path: 'footer/footer-template'
				},
				{
					text: 'Grouping with Footer',
					path: 'footer/grouping-footer'
				}
			]
		},
		{
			text: 'Other Features',
			children: [
				{
					text: 'Grouped Column Header',
					path: '28ad3uuf',
					img: 'basic-array-grid.gif',
					description: '????????'
				},
				{
					text: 'Infinite Scroll'
				},
				{
					text: 'Property Grid'
				},
				{
					text: 'Large Dataset',
				}
			]
		}
	];

	$scope.showItem = function(itemRepeat) {
		if (itemRepeat.$last && itemRepeat.$parent.$last) {
			$('.examples-ui-deni-grid').css('display', 'block');
		}

		return true;
	}

	$scope.itemClick = function(item) {
		//deniModalSrv.ghost('Title test', "Messages Here!");

		var path = item.path || '';
		if (path != '') {
			if (path.length == 8) { //jsfiddle
				path = '//jsfiddle.net/' + path + '/embedded/result,html,js,css,resources/';
			}
		}
		
		var htmlTemplate = '<div class="modal-exemple">\n' +
		                   '    <div class="modal-exemple-title"	>\n' +
		                   '        ' + item.description + '\n' +
		                   '    </div>\n' +		                   
		                   '    <iframe class="modal-exemple-iframe" src="' + path + '" allowfullscreen="allowfullscreen" frameborder="0"></iframe>\n' +
						   '    <a href="http://jsfiddle.net/denimar/' + item.path + '/embedded/result,html,js,css,resources/" target="_blank">view in a new window</a>\n' +
		                   '</div>';

	 	var config = {
			width: '800px',
			height: '600px',
			position: deniModalSrv.POSITION.CENTER,
			modal: true,
			htmlTemplate: htmlTemplate,
			title: item.text
		};

		var objWindow = deniModalSrv.createWindow(config);		
		objWindow.show();
	}

	/*
	$scope.getItemClass = function(menuLevel, item) {
		var classItems;

		if (menuLevel == 1) {
			classItems = 'menu-item level1';
		} else if (menuLevel == 2) {
			classItems = 'menu-item level2';
		} else if (menuLevel == 3) {
			classItems = 'menu-item level3';
		} else if (menuLevel == 4) {
			classItems = 'menu-item level4';
		}

		if (item.children) {
			classItems += ' hasParent';

			if (item.collapsed) {
				classItems += '	collapsed';			
			} else {
				classItems += '	expanded';							
			}
		} else {
			if (item.selected) {
				classItems += '	selected';	
			}
		}

		return classItems;
	}

	$scope.itemClick = function(itemClicked) {
		if (itemClicked.children) {
			$scope.setCollapsed(itemClicked, !itemClicked.collapsed);
		} else {
			$scope.selectItem(itemClicked);
		}	
	}

	$scope.setCollapsed = function(itemToSet, collapsed) {
		itemToSet.collapsed = collapsed;

		if ((itemToSet.collapsed) && (itemToSet.children)) {
			for (var index = 0 ; index < itemToSet.children.length ; index++) {
				var item = itemToSet.children[index];
				//
				if (item.children) {
					$scope.setCollapsed(item, itemToSet.collapsed);
				}	
			}
		}	
	}

	$scope.exampleImg = '';
	$scope.exampleTitle = '';
	$scope.exampleDescription = '';
	$scope.selectItem = function(itemToSelect) {
		$scope.exampleImg = itemToSelect.img;
		$scope.exampleTitle = itemToSelect.text;
		$scope.exampleDescription = itemToSelect.description;

		//remove all selections
		for (var index = 0 ; index < $scope.examples.length ; index++) {
			$scope.setSelected($scope.examples[index], false, true);
		}
		//
		$scope.setSelected(itemToSelect, true);
		var path = itemToSelect.path || '';
		if (path != '') {
			path = '//jsfiddle.net/' + path + '/embedded/result,html,js,css,resources/';
		}
		
		console.info(path);
		var iFrame = $('.main').find('iframe');
		iFrame.attr('src', path);
		//$('.main').load(itemToSelect.path || '');
	}

	$scope.setSelected = function(itemToSelect, selected, recursive) {
		itemToSelect.selected = selected;
		if ((recursive) && (itemToSelect.children)) {
			for (var index = 0 ; index < itemToSelect.children.length ; index++) {
				$scope.setSelected(itemToSelect.children[index], selected, recursive);
			}
		}
	}

	$scope.selectItem($scope.examples[0].children[0]);
	*/

});