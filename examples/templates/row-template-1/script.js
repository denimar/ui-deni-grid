//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    var customTemplate = '<div style="padding-left:5px;width:100%;color:gray;">\n' +
                         '    <img style="float:left;width:76px;height:64px;margin-right:4px;"\n' +
                         '        src="http://image.tmdb.org/t/p/w150/{poster_path}" \n' +
                         '    />\n' +                                  
                         '    {overview}\n' +
                         '<div>';

    $scope.gridOptions = {
        rowHeight: '72px', //22px is default
        url: '../../../examples/data/movies/movies-01000.json',
        rowTemplate: customTemplate,
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

