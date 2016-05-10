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
        url: '../../../data/employees/employees-00500.json',
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


    /*
    $scope.loadData = function() {
        $http.get('../data/employees-02000.json').then(function(response) {
            $scope.gridOptions.api.loadData(response.data);
        });
    }
    */

    $scope.selectThirdRow = function() {
        $scope.gridOptions.api.selectRow(452, false, true);
    }

    $scope.changeSelectedRow = function() {
        $scope.gridOptions.api.updateSelectedRow({
            name: 'Denimar de Moraes',
            address: {
                city: 'Blumenau'
            },
        });
    }

    $scope.sortByCityDesc = function() {
        $scope.gridOptions.api.sort({
            name: 'address.city',
            direction: 'DESC'
        }, true); //true is default (just for example)
    }

    $scope.getSelectedRowIndex = function() {
        $('.divResponse').html('current index is : ' + $scope.gridOptions.api.getSelectedRowIndex());
    }

    $scope.getChangedRecords = function() {
        console.info($scope.gridOptions.api.getChangedRecords());
        alert('See the browser console...');
    }

    /////////////////////////////////////////////////////
    $('#textAreaFind').html(JSON.stringify({'name': 'Rosa'}, null, '  '));

    $scope.clickOptionsCheck = function() {
        var json = {};
        
        var ignoreCase = $('#ckIgnoreCase').is(":checked");
        if (ignoreCase) json.ignoreCase = ignoreCase;

        var exactSearch = $('#ckExactSearch').is(":checked");        
        if (!exactSearch) json.exactSearch = false;

        var all = $('#ckAll').is(":checked");        
        if (all) json.all = all;   

        var inLine = $('#ckInline').is(":checked");        
        //if (inLine) json.inLine = inLine;   
        if (inLine) json.inLine = {realce: true};

        var strJson = JSON.stringify(json, null, '  ');
        $('#textAreaOptions').html(strJson);
    }
    $scope.clickOptionsCheck();

    $scope.find = function() {
        var jsonFind = $('#textAreaFind').val();
        var jsonOptions = $('#textAreaOptions').val();        

        try {
            $('#textAreaResponse').html('');            
            var responseFind = $scope.gridOptions.api.find(eval('(' + jsonFind + ')'), eval('(' + jsonOptions + ')'));
            var json = JSON.stringify(responseFind, true, '  ');
            $('#textAreaResponse').html(json);
        } catch (e) {
            $('#textAreaResponse').html(e);    
            console.log(e);        
        }    
                
    }

    $scope.toogleColumnHeaders = function() {
        $scope.gridOptions.api.setHideHeaders(!$scope.gridOptions.api.isHideHeaders());
    }
    //////////////////////////////////////


});

