//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        fixedCols: {
            checkbox: true,
        },
        url: '../../data/movies/movies-00500.json',
        columns: [
            { 
                header:'Id', 
                name: 'id', 
                width: '90px',
                align: 'right',
            },
            { 
                header:'Title', 
                name: 'title', 
                width: '200px',
                align: 'left',
            },
            { 
                header:'Popularity', 
                name: 'popularity', 
                width: '120px',
                align: 'right'
            },
            {
                header: 'Release',
                name: 'release_date',
                width: '150px',
                align: 'center'
            },            
            {
                header: 'Votes',
                name: 'vote_count',
                width: '100px',
                align: 'center'
            },

        ]
    };

});

