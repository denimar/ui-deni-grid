//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: '../../data/employees/00100.json',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '50%', 
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '10%', 
                align: 'right'
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '30%', 
            },
            { 
                width: '5%',
                action: {
                    icon: '../../images/edit.png',
                    tooltip: 'Edit that employee...',
                    fn: function(record) {
                        alert('Editing user "' + record.name + '"...');
                    }
                }   
            },
            { 
                width: '5%',
                action: {
                    icon: '../../images/delete.png',
                    tooltip: 'Delete that employee...',
                    fn: function(record) {
                        alert('Deleting user "' + record.name + '"...');
                    }
                }   
            },            
        ]
	};

});

