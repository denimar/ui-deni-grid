(function() {

	'use strict';

	angular
		.module('uiDeniGridDropdownItemModule')
		.run(['$templateCache', function($templateCache) {

			/**
			 * template: ui-deni-grid-dropdown-item.view.html
			 * Directive's template
			 *
			 */
			$templateCache.put('ui-deni-grid-dropdown-item.view.html',
				'<div class="ui-deni-grid-dropdown-item-container unselectable" ng-class="{\'separator\' : ctrl.menuItem.separator}" ng-click="ctrl.menuItem.click()">\n' +

				'	<div class="ui-deni-grid-dropdown-item-inner" >\n' +

				'		<div class="ui-deni-grid-dropdown-item-center-container">\n' +
				'			<div class="ui-deni-grid-dropdown-item-center-inner">\n' +
				'				<div class="ui-deni-grid-dropdown-item-center-image-checkbox">	\n' +
				'				<img src="{{ctrl.menuItem.icon}}">\n' +
				'				</div>\n' +
				'			</div>\n' +
				'		</div>\n' +

				'		<div class="ui-deni-grid-dropdown-item-caption" ng-bind-html="ctrl.rendererItem(this, ctrl.menuItem)">\n' +
				'		</div>\n' +

				'	</div>\n' +

				'</div>'
			);

			/**
			 * template: date-filter.template.html
			 * Used by menu items which will show filters type "date"
			 *
			 */
			$templateCache.put('date-filter.template.html',
				'<div class="filter-field-type-date-container">\n' +

				'	<div class="filter-field-type-date-row">\n' +
				'		<span class="filter-field-type-date-caption">>=</span>\n' +
				'		<input class="filter-field-type-date" type="text" onfocus="(this.type=\'date\')" onblur="(this.type=\'text\')" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-date-row">\n' +
				'		<span class="filter-field-type-date-caption"><=</span>\n' +
				'		<input class="filter-field-type-date" type="text" onfocus="(this.type=\'date\')" onblur="(this.type=\'text\')" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-date-row">\n' +
				'		<span class="filter-field-type-date-caption">=</span>\n' +
				'		<input class="filter-field-type-date" type="text" onfocus="(this.type=\'date\')" onblur="(this.type=\'text\')" autofocus />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-date-button-container">\n' +
				'		<button class="filter-field-type-date-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
			);

			/**
			 * template: datetime-filter.template.html
			 * Used by menu items which will show filters type "datetime"
			 *
			 */
			$templateCache.put('datetime-filter.template.html',
				'<div class="filter-field-type-datetime-container">\n' +

				'	<div class="filter-field-type-datetime-row">\n' +
				'		<span class="filter-field-type-datetime-caption">>=</span>\n' +
				'		<input class="filter-field-type-datetime" type="datetime-local" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-datetime-row">\n' +
				'		<span class="filter-field-type-datetime-caption"><=</span>\n' +
				'		<input class="filter-field-type-datetime" type="datetime-local" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-datetime-button-container">\n' +
				'		<button class="filter-field-type-datetime-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
		 	);

			/**
			 * template: float-filter.template.html
			 * Used by menu items which will show filters type "float"
			 *
			 */
			$templateCache.put('float-filter.template.html',
				'<div class="filter-field-type-float-container">\n' +

				'	<div class="filter-field-type-float-row">\n' +
				'		<span class="filter-field-type-float-caption">>=</span>\n' +
				'		<input class="filter-field-type-float" type="number" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-float-row">\n' +
				'		<span class="filter-field-type-float-caption"><=</span>\n' +
				'		<input class="filter-field-type-float" type="number" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-float-row">\n' +
				'		<span class="filter-field-type-float-caption">=</span>\n' +
				'		<input class="filter-field-type-float" type="number" autofocus />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-float-button-container">\n' +
				'		<button class="filter-field-type-float-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
			);

			/**
			 * template: integer-filter.template.html
			 * Used by menu items which will show filters type "integer"
			 *
			 */
			$templateCache.put('integer-filter.template.html',
				'<div class="filter-field-type-integer-container">\n' +

				'	<div class="filter-field-type-integer-row">\n' +
				'		<span class="filter-field-type-integer-caption">>=</span>\n' +
				'		<input class="filter-field-type-integer" type="number" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-integer-row">\n' +
				'		<span class="filter-field-type-integer-caption"><=</span>\n' +
				'		<input class="filter-field-type-integer" type="number" />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-integer-row">\n' +
				'		<span class="filter-field-type-integer-caption">=</span>\n' +
				'		<input class="filter-field-type-integer" type="number" autofocus />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-integer-button-container">\n' +
				'		<button class="filter-field-type-integer-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
			);

			/**
			 * template: multiselect-filter.template.html
			 * Used by menu items which will show filters type "multiselect"
			 *
			 */
			$templateCache.put('multiselect-filter.template.html',
				'<div class="filter-field-type-multiselect-container">\n' +

				'	<div class="filter-field-type-multiselect-row" ng-repeat="item in items">\n' +
				'		<label>\n' +
				'			<input type="checkbox" name="{{item.key}}" value="{{item.key}}">\n' +
				'			<span>{{item.value}}</span>\n' +
				'		</label>\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-multiselect-button-container">\n' +
				'		<button class="filter-field-type-multiselect-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
			);

			/**
			 * template: select-filter.template.html
			 * Used by menu items which will show filters type "select"
			 *
			 */
			$templateCache.put('select-filter.template.html',
				'<div class="filter-field-type-select-container">\n' +

				'	<div class="filter-field-type-select-row" ng-repeat="item in items">\n' +
				'		<label>\n' +
				'			<input type="radio" name="selectField" key="{{item.key}}" value="{{item.value}}">\n' +
				'			<span>{{item.value}}</span>\n' +
				'		</label>\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-select-button-container">\n' +
				'		<button class="filter-field-type-select-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
			);


			/**
			 * template: string-filter.template.html
			 * Used by menu items which will show filters type "string"
			 *
			 */
			$templateCache.put('string-filter.template.html',
				'<div class="filter-field-type-string-container">\n' +

				'	<div class="filter-field-type-string-row">\n' +
				'		<span class="filter-field-type-string-caption">~</span>\n' +
				'		<input class="filter-field-type-string" ng-value="filterModel.nome" type="text" autofocus autoselect />\n' +
				'	</div>\n' +

				'	<div class="filter-field-type-string-button-container">\n' +
				'		<button class="filter-field-type-string-button">Filter</button>\n' +
				'	</div>\n' +

				'</div>'
			);

		}]);

})();
