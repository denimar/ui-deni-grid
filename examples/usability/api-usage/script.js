//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http, $sce, $compile) {

    //
    this.gridOptions = {
      url: 'https://denimar.github.io/static-data/employees/01000.json',
      autoLoad: false,
      columns: [
        {
          header:'Hiring Date',
          name: 'hiringDate',
          width: '15%',
          align: 'center'
        },
        {
          header:'Name',
          name: 'name',
          width: '30%'
        },
        {
          header:'Company',
          name: 'company',
          width: '35%'
        },
        {
          header:'Gender',
          name: 'gender',
          width: '20%'
        }
      ]
	};

  //
  this.load = function() {
    _getApi().load();
  };

  //
  this.reload = function() {
    _getApi().reload();
  };

  //
  this.selectThirdRow = function() {
    _getApi().selectRow(3);
  };

  //
  this.getSelectedRow = function() {
    var selectedRow = _getApi().getSelectedRow();
    if (selectedRow) {
      _setResult(JSON.stringify(selectedRow, null, 2));
    } else {
      _setResult('No items selected');
    }

  }

  function _getApi() {
    return angular.element('.deniGrid').api;
  }

  function _setResult(result) {
    var textarea = angular.element('textarea');
    textarea.val(result);
  }



});
