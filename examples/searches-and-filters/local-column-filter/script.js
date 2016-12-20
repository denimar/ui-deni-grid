//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http, $sce, $compile) {

    $scope.gridOptions = {
		url: 'https://denimar.github.io/static-data/employees/01000.json',
        columns: [
            {
                header:'Hiring Date',
                name: 'hiringDate',
                width: '10%',
                align: 'center',
                filter: {
                    type: 'date'
                }
            },
            {
                header:'Namedddddddddddd',
                name: 'name',
                width: '30%',
                filter: {
                    type: 'string',
                    renderer: function(containerElm) {
                      var htmlItem = '<input type="date" />';
              				var trustedHtml = $sce.trustAsHtml(htmlItem);
                      var input = angular.element(trustedHtml);
                      var compiledInput = $compile(htmlItem) ($scope);
                      containerElm.append(compiledInput);
                      /*
                      var input = document.createElement('input');
                      containerElm.append(input);
                      //input.value = 'denimar';
                      */

                    },
                    getFilterModel: function(containerElm) {
                      var input = containerElm.find('input');
                      return {
                        name: {
                          key: input.val(),
                          oper: '~',
                          value: input.val()
                        }
                      }
                    },
                    setValuesInputs: function(containerElm, filterModel) {
                      var input = containerElm.find('input');
                      input.val(filterModel['name'].value);
                    }
                },
                sortable: false
            },
            {
                header:'Company',
                name: 'company',
                width: '30%',
                filter: {
                    type: 'string'
                }
            },
            {
                header:'Gender',
                name: 'gender',
                width: '15%',
                filter: {
                    type: 'multiSelect',
                    items: [
                        {
                            key: 'male',
                            value: 'male'
                        },
                        {
                            key: 'female',
                            value: 'female'
                        }
                    ]
                }
            },
            {
                header:'Eye Color',
                name: 'eyeColor',
                width: '15%',
                filter: {
                    type: 'select',
                    items: [
                        {
                            key: 'blue',
                            value: 'blue'
                        },
                        {
                            key: 'green',
                            value: 'green'
                        },
                        {
                            key: 'black',
                            value: 'black'
                        },
                        {
                            key: 'brown',
                            value: 'brown'
                        },
                    ]
                }
            },
            {
                header:'Age',
                name: 'age',
                width: '10%',
                align: 'right',
                filter: {
                    type: 'integer'
                }
            },
        ]
	};

});
