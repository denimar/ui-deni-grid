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
        columnFooterRowHeight: '35px', //default = '22px'        
        footerRowTemplate: '<div class="custom-row-template">\n' +
                           '    <div>\n' + 
                           '        <img src="cake.png" />\n' +
                           '        <span><b>{age.text}</b>{age.value}</span>\n' +
                           '    </div>\n' +                            
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
                    {
                        fn: 'SUM',
                        text: 'Sum of the ages : '
                    },    
                    {
                        fn: 'AVG',
                        text: 'Average of the ages : '
                    },    
                    {
                        fn: 'MAX',
                        text: 'Highest age : '
                    },    
                    {
                        fn: 'MIN',
                        text: 'Lowest age : '
                    }
                ]
            },
        ]
    };

});

