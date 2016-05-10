//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    var customTemplate = '<div style="display:flex;padding-left:5px;width:100%;">\n' +
                         '    <img style="float:left;width:76px;height:64px;"\n' +
                         '        src="http://image.tmdb.org/t/p/w150/{poster_path}" \n' +
                         '    />\n' +                                  
                         '    <span style="height:64px;margin-left:4px;color:darkolivegreen;overflow-y:auto;">\n' +
                         '        {overview}\n' +
                         '    </span>\n' +                      
                         '<div>';

    $scope.gridOptions = {
        idField: 'id',
        rowHeight: '72px', //22px is default
        hideHeaders: false, //false is default  
        stripRows: true, //true is default       
        enableColumnResize: true, //true is default
        sortableColumns: true, //true is default
        //multiSelect: true, //default is false 
        url: '../../../data/movies/movies-10000.json',
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

