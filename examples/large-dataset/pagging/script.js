//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'http://fakedata-denimarm.rhcloud.com/data?type=employees',
    paging: true,
    columns: [{
      header: 'Name',
      name: 'name',
      width: '30%',
    }, {
      header: 'Company',
      name: 'company',
      width: '30%',
    }, {
      header: 'City',
      name: 'address.city',
      width: '30%',
    }, {
      header: 'Age',
      name: 'age',
      width: '10%',
      align: 'right'
    }]
  }

});
