//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        idField: 'id',
        rowHeight: '22px', //22px is default
        //hideHeaders: false, //false is default 
        stripRows: true, //true is default       
        enableColumnResize: true, //true is default
        sortableColumns: true, //true is default
        //multiSelect: true, //default is false  
        //rowNumber: true,
        url: '../../../data/employees/employees-10000.json',
        //sorters: 'name',
        grouping: {
            expr: 'age',
            template: '<b>{age}</b> ({count})'
        },
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '40%', 
                align: 'left',
                /*
                renderer: function(value, record, cols, rowIndex) {
                    return value + ' - ' + record.address.city;
                }
                */
            },
            {
                header: 'City',
                name: 'address.city',
                width: '35%',
                align: 'left'
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '15%', 
                align: 'left',
                style: {
                    color: 'orange'
                },
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '10%', 
                align: 'right'
            },
        ],
        listeners: {
            onselectionchange: function(controller, element, rowIndex, record) {
                $('.divResponse').html(angular.toJson(record, 2));
            }
        }
    };


    $scope.checkGrouping = function(event) {
        if (event.target.checked) {
          $scope.gridOptions.api.setEnableGrouping();
        } else {
          $scope.gridOptions.api.setDisableGrouping();
        }
    }

    $scope.selectThirdRow = function() {
        $scope.gridOptions.api.selectRow(452, false, true);
    }

});

