//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/01000.json',
    cardView: {
		numberOfColumns: 3,
		template: '<div style="border:solid 1px green;">{name}</div>',
		rowHeight: 80 //default=80
	}
  }

});
