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
        //multiSelect: true, //default is false  
        url: '../../../../data/employees/employees-01000.json',
        //sorters: 'name',
        footerTemplate: '<div class="custom-footer-row-template">\n' +
                        '    <div class="data-panel">\n' +        
                        '        <div style="font-weight:bold; color:green; background-color:#f2f2f2; ">Ages :</div>\n' +                        
                        '        <div><b>Sum : </b>{age(0).value} </div>\n' +
                        '        <div><b>Average : </b>{age(1).value} </div>\n' +
                        '        <div><b>Highest age : </b>{age(2).value} </div>\n' +                        
                        '        <div><b>Lowest age : </b>{age(3).value} </div>\n' +                        
                        '    </div>\n' +
                        '    <img src="ages.png" />\n' +                                   
                        '</div>',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '35%', 
                align: 'left',
            },
            {
                header: 'City',
                name: 'address.city',
                width: '25%',
                align: 'left'
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '15%', 
                align: 'left'
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '25%', 
                align: 'right',
                format: 'float',
                footer: [
                    'SUM',
                    'AVG',
                    'MAX',
                    'MIN'
                ]
            },
        ]
    };

});

