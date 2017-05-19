//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/static-data/employees/01000.json',
        columns: [{
            header: 'Name',
            name: 'name',
            width: '50%',
        }, {
            header: 'Age',
            name: 'age',
            width: '10%',
            align: 'right'
        }, {
            header: 'Gender',
            name: 'gender',
            width: '30%',
        }, {
            width: '5%',
            action: {
                icon: 'https://denimar.github.io/ui-deni-grid/examples/images/edit.png',
                tooltip: 'Edit that employee...',
                fn: function(record) {
                    alert('Editing user "' + record.name + '"...');
                }
            }
        }, {
            width: '5%',
            action: {
                icon: 'https://denimar.github.io/ui-deni-grid/examples/images/delete.png',
                tooltip: 'Delete that employee...',
                fn: function(record) {
                    alert('Deleting user "' + record.name + '"...');
                }
            }
        }, ]
    };

});
