//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'https://denimar.github.io/ui-deni-grid/examples/data/movies/00100.json',
    cardView: {
		  numberOfColumns: 5,
		  template: '<div class="card-view-item">\n' +
                    '    <img class="card-view-image" src="http://image.tmdb.org/t/p/w150/{poster_path} />"\n' +
                    '</div>',
		  rowHeight: 180, //default=150
	  },
    listeners: {
      onselectionchange: function(record) {
        console.clear();
        console.log(JSON.stringify(record, false, '    '));
      }
    }

  }

});
