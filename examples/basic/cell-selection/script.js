//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'https://fakedata-denimarm.rhcloud.com/data?type=employees',
        selType: 'cell', //default = row
        paging: {
            pageSize: 20
        },
        columns: [{
            header: 'Name',
            name: 'name',
            width: '50%',
        }, {
            header: 'Gender',
            name: 'gender',
            width: '30%',
        }, {
            header: 'Age',
            name: 'age',
            width: '80px',
            align: 'right'
        }, ]
    };

});
