//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: '../data/employees/05000.json',
        selType: 'cell', //default = row
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '30%', 
                align: 'left',
            },
            {
                header: 'City',
                name: 'address.city',
                width: '30%',
                align: 'left'
            },
            { 
                header:'Company', 
                name: 'company', 
                width: '30%', 
                align: 'left'
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '10%', 
                align: 'right'
            },
        ]
    };

});

