//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    var customTemplate = '<div style="display:flex;padding-left:5px;width:100%;">\n' +
                         '    <img style="float:left;width:76px;height:64px;"\n' +
                         '        src="http://image.tmdb.org/t/p/w150/{poster_path}" \n' +
                         '    />\n' +                                  
                         '    <span style="height:64px;margin-left:4px;color:darkolivegreen;overflow-y:auto;">\n' +
                         '        {overview}\n' +
                         '    </span>\n' +                      
                         '<div>';

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/movies/00500.json',
        rowDetails: {
            height: '72px', //50 is default
            template: customTemplate,
            autoExpand: false, //default = false
            renderer: function(element, record) { //when template is filled, the renderer parameter is ignored
                //...
            }
        },
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

