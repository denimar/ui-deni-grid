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
        url: '../../../data/employees/employees-10000.json',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '20%', 
                align: 'left',
            },
            {
                header: 'Address',
                width: '40%',
                align: 'center',
                columns: [
                    {
                        header: 'City',
                        name: 'address.city',
                        width: '50%',
                        align: 'left',
                    },
                    {
                        header: 'State',
                        name: 'address.state',
                        width: '50%',
                        align: 'left'
                    },
                ]
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '40%', 
                align: 'right'
            },
        ],
        listeners: {
            onselectionchange: function(controller, element, rowIndex, record) {
                $('.divResponse').html(angular.toJson(record, 2));
            }
        }
    };

});

