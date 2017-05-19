angular.module('myApp', []);

angular.module('myApp').controller('MainCtrl', function($scope) {

	$scope.examples = [
		{
			text: 'Basic',
			children: [
				{
					text: 'Basic Array Grid',
					path: '3nfdckrg'
				},
				{
					text: 'Binding to Local JSON',
					path: '88jxkb1w'
				},
				{
					text: 'Binding to remote JSON',
					path: 'mc6a24xb'
				},
				{
					text: 'Binding to Local XML',
					path: 'otey42jd'
				},
				{
					text: 'Binding to remote XML',
					path: '0u7h2dxd'
				},
			],
		},
		{
			text: 'Card View',
			children: [
				{
					text: 'Simple Card View',
					path: 't9Lzuyvf'
				},
				{
					text: 'Card View with Checkbox',
					path: 'uhh0v779'
				},
				{
					text: 'Card View with Endless Paging',
					path: 'tnn61pkm'
				},
			],
		},
		{
			text: 'searches and filters',
			children: [
				{
					text: 'Filtering',
					path: '7vyhnv36'
				}
			]
		},
		{
			text: 'Large Dataset',
			children: [
				{
					text: 'Paging 1',
					path: 'pjvorqas'
				},
				{
					text: 'Paging 2',
					path: 'f1pLcwLw'
				}
			],
		},
		{
			text: 'Fixed Columns',
			children: [
				{
					text: 'Checkbox',
					path: 'gv3sgjpy'
				},
				{
					text: 'Fixed Columns',
					path: 'mousxpr5'
				},
				{
					text: 'Indicator',
					path: 'v5p3s45x'
				},
				{
					text: 'Row Number',
					path: '4s22s15b'
				},
			]
		},
		{
			text: 'Templates',
			children: [
				{
					text: 'Row Template 1',
					path: 'z075e6d0'
				},
				{
					text: 'Row Template 2',
					path: '0hhue7rk'
				},
				{
					text: 'Footer Template',
					path: 'ysp0vdmh'
				},
				{
					text: 'Footer Row Template',
					path: 'dervvL56'
				},
			]
		},
		{
			text: 'Grouping',
			children: [
				{
					text: 'Grouping',
					path: 's9n0x5b7'
				},
				{
					text: 'Grouping with Footer',
					path: 'sywnb63x'
				}
			]
		},
		{
			text: 'Selection',
			children: [
				{
					text: 'Simple Cell Selection',
					path: 'xw5726xv'
				}
			]
		},
		{
			text: 'Other Features',
			children: [
				{
					text: 'Grouped Column Header',
					path: '28ad3uuf'
				},
				{
					text: 'Row Expand',
					path: '352aacqc'
				},
				{
					text: 'Action Column',
					path: 'gxpa6yzt'
				}
			]
		}
	];

	$scope.itemClick = function(item) {
		$scope.activeItem = item;
		var elemFrame = document.getElementById('example-preview-iframe');
		elemFrame.src = 'https://jsfiddle.net/denimar/' + item.path + '/embedded/result,html,js,css,resources/';
	}

	$scope.itemClick($scope.examples[0].children[0]);


});
