//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'https://denimar.github.io/static-data/employees/05000.json',
        columns: [
            { 
                header:'Hiring Date', 
                name: 'hiringDate', 
                width: '10%', 
                align: 'center', 
                filter: {
                    type: 'date'
                }
            },        
            { 
                header:'Name', 
                name: 'name', 
                width: '30%', 
                filter: {
                    type: 'string'
                },
                sortable: false
            },
            { 
                header:'Company', 
                name: 'company', 
                width: '30%', 
                /*
                filter: {
                    type: 'string'
                }
                */
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

