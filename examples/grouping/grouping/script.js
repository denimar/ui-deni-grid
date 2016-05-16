//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/employees-10000.json',
    grouping: {
      expr: 'company',
      template: '<b>{company}</b> ({count})'
    },
    columns: [{
      header: 'Name',
      name: 'name',
      width: '40%',
    }, {
      header: 'Gender',
      name: 'gender',
      width: '20%'
    }, {
      header: 'Company',
      name: 'company',
      width: '30%',
    }, {
      header: 'Age',
      name: 'age',
      width: '10%',
      align: 'right'
    }]
  }

});
