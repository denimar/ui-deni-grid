//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'http://denimar.github.io/static-data/employees/00500.json',
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

