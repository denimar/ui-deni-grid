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
        url: '../../../data/movies/movies-00100.json',
        filterRow: true, //look at this "http://demos.telerik.com/kendo-ui/grid/filter-row". https://demos.devexpress.com/aspxgridviewdemos/Filtering/FilterRow.aspx, https://www.youtube.com/watch?v=QMbtzgVA8oo
        columns: [
            { 
                header:'Title', 
                name: 'title', 
                width: '60%', 
                align: 'left',
            },
            { 
                header:'Popularity', 
                name: 'popularity', 
                width: '20%', 
                align: 'right'
            },
            {
                header: 'Release',
                name: 'release_date',
                width: '20%',
                align: 'center'
            }
        ]
    };

});

