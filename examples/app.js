angular.module('myApp', []);

angular.module('myApp').controller('MainCtrl', function($scope) {

	$scope.examples = [
		{
			text: 'Basic',
			children: [
				{
					text: 'Basic Array Grid',
					img: 'basic-array-grid.gif',
					path: '3nfdckrg/29',
					description: 'This is a simple example using a array local data'
				}
			],
		},
		{
			text: 'Data Binding',
			collapsed: true,
			children: [
				{
					text: 'Binding to Array',
					img: 'basic-array-grid.jpg',					
					path: 'jg3wmhw9/8',
					description: 'A more complex example'
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
				{
					text: 'Large Dataset',
				},

			],
		},
		{
			text: 'Grouping',
			collapsed: true,
			children: [
				{
					text: 'Grouping',
				},
				{
					text: 'Cell Selection',
				},
				{
					text: 'Grouping with Footer',
					path: 'footer/grouping-footer'
				}
			]
		},
		{
			text: 'Selection',
			collapsed: true,
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
			collapsed: true,
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
		},
		{
			text: 'Filtering',
			collapsed: true,
			children: [
				{
					text: 'Row Filter',
					collapsed: true,
					children: [
						{
							text: 'Local Row Filter'
						},
						{
							text: 'Remote Row Filter'
						}
					]
				}
			]		
		},
		{
			text: 'Drag and Drop',
		},
		{
			text: 'Templates',
			collapsed: true,
			children: [
				{
					text: 'Row Template'
				},
				{
					text: 'Footer Template'
				},
				{
					text: 'Footer Row Template'
				},
			]
		},		
		{	
			text: 'Footer',
			collapsed: true,
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
			collapsed: true,
			children: [
				{
					text: 'Grouped Column Header'
				},
				{
					text: 'Infinite Scroll'
				},
				{
					text: 'Property Grid'
				},
			]
		}
	];


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
			path = '//jsfiddle.net/denimar/' + path + '/embedded/result,html,js,css,resources/';
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


});