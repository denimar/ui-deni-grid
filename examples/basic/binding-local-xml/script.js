//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'news.xml',
        restConfig: {
            type: 'xml',
            data: 'results',
            dataItems: 'news_item',
            total: 'num_results',
            start: 'offset',
            limit: 'limit'
        },  
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '50%', 
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '30%', 
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '20%', 
                align: 'right'
            },
        ]
	};

});

