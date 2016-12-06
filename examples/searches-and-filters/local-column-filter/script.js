//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'https://denimar.github.io/static-data/employees/00500.json',
        filter: {
            url: 'http://localhost:8082/notificacao/panel/messages'
        },
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '30%', 
                filter: {
                    type: 'string'
                }
            },
            { 
                header:'Company', 
                name: 'company', 
                width: '30%', 
                filter: {
                    type: 'string'
                }
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '15%', 
                filter: {
                    type: 'multiSelect',
                    items: [
                        {
                            key: 'male',
                            value: 'male'
                        },
                        {
                            key: 'female',
                            value: 'female'
                        }
                    ]
                }  
            },
            { 
                header:'Eye Color', 
                name: 'eyeColor', 
                width: '15%',
                filter: {
                    type: 'select',
                    items: [
                        {
                            key: 'blue',
                            value: 'blue'
                        },
                        {
                            key: 'green',
                            value: 'green'
                        },
                        {
                            key: 'black',
                            value: 'black'
                        },
                        {
                            key: 'brown',
                            value: 'brown'
                        },
                    ]
                }
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '10%', 
                align: 'right', 
                filter: {
                    type: 'integer'
                }
            },
        ]
	};

});

