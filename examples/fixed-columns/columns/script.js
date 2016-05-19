//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        idField: 'id',
        rowHeight: '22px', //22px is default
        hideHeaders: false, //false is default  
        stripRows: true, //true is default       
        enableColumnResize: true, //true is default
        sortableColumns: true, //true is default
        //selType: 'cell', //'row' is default
        //multiSelect: true, //default is false 
        fixedCols: {
            columns: ['id', 'title']
        },
        url: '../../../data/movies/movies-00500.json',
        columns: [
            { 
                header:'Id', 
                name: 'id', 
                width: '10%',
                align: 'right',
            },
            { 
                header:'Title', 
                name: 'title', 
                width: '45%',
                align: 'left',
            },
            { 
                header:'Popularity', 
                name: 'popularity', 
                width: '15%',
                align: 'right'
            },
            {
                header: 'Release',
                name: 'release_date',
                width: '15%',
                align: 'center'
            },            
            {
                header: 'Votes',
                name: 'vote_count',
                width: '15%',
                align: 'center'
            },

        ]
    };

});

