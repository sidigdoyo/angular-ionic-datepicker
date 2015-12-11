/**
 * angular-ionic-datepicker
 * @version v0.0.1
 * @link https://github.com/sidigdoyo/angular-ionic-datepicker
 * @license MIT
 * @author Sidigdoyo Pribadi <sidigdoyo@gmail.com>
 */

(function(window, angular, undefined) {
	

	//******** datepicker provider *********************************************************************************************************************************
	var ionDatepickerProvider = function() {
		var self = this;

		var $ionDatepicker = function() {

		};
		$ionDatepicker.$inject = [];

		self.$get = $ionDatepicker;

	};
	ionDatepickerProvider.$inject = [];

	//******** datepicker factory *********************************************************************************************************************************
	var ionDatepickerService = function($ionDatepicker, $window) {
		var month = [];
		var daysInMonth = [];
		var temp = new Date();
		var _min, _max;
		var formatDate;

		var getDaysInMonth = function(month, year) {
			var date = new Date(year, month, 1);
			var days = [];

			while (date.getDay() !== 0) {
				date.setDate(date.getDate() - 1);
				days.unshift(new Date(date));
			}

			if(date.getMonth() !== month) {
				date = new Date(year, month, 1);
			}

			while (date.getMonth() === month) {
				if(date.getDate() === 1) {
					_min = new Date(date);
				} else {
					_max = new Date(date);
				}
				days.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}

			while (date.getDay() !== 0) {
				days.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}

			return days;
		};

		var nextMonth = function(current) {
			var month = current.getMonth();
			var year = current.getFullYear();
			if(month + 1 === 12) {
				month = 0;
				year += 1;
			} else {
				month += 1;
			}
			current.setMonth(month);
			current.setFullYear(year);
			return current;
		};

		var prevMonth = function(current) {
			var month = current.getMonth();
			var year = current.getFullYear();
			if(month - 1 === -1) {
				month = 11;
				year -= 1;
			} else {
				month -= 1;
			}

			current.setMonth(month);
			current.setFullYear(year);
			return current;
		};

		return {
			getDaysInMonth: getDaysInMonth,
			today: function() {
				return new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
			},
			getDays: function() {
				return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			},
			getCurrent: function() {
				return {
					min: _min,
					max: _max
				};
			},
			getMonths: function() {
				var count = 0;
				var months = [];
				while (count < 12) {
					months.push($window.moment().month(count++).format("MMMM"));
				}

				return months;
			},
			getYears: function(index) {
				var now = new Date();
				var thisYear = now.getFullYear();

				if(index) {
					thisYear = index;
				}

				var years = [];
				for(var i=thisYear - 6; i< thisYear + 6; i++) {
					years.push(i);
				}
				return years;
			},
			nextMonth: nextMonth,
			prevMonth: prevMonth
		};
	};
	ionDatepickerService.$inject = ["$ionDatepicker", "$window"];

	//******** datepicker directive *********************************************************************************************************************************
	ionDatepickerCtrl = function($scope, $ionicPopup, $filter, service) {
		var vm = this;
		vm.hasMinValue = false;

		if(vm.minDateValue) {
			vm.minDateValue = new Date(vm.minDateValue.getFullYear(), vm.minDateValue.getMonth(), vm.minDateValue.getDate());
			vm.hasMinValue = true;
		}
		vm.today = service.today();
		vm.weeks = service.getDays();
		vm.currentDate = service.today();

		if(vm.model) {
			vm.currentDate = angular.copy(vm.model);
		}
		vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
		vm.currentMonth = service.getCurrent();

		vm.nextMonth = function() {
			vm.currentDate = service.nextMonth(vm.currentDate);
			vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
			vm.currentMonth = service.getCurrent();
		};
		vm.prevMonth = function() {
			vm.currentDate = service.prevMonth(vm.currentDate);
			vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
			vm.currentMonth = service.getCurrent();
		};

		vm.prevYear = function() {
			vm.currentDate.setFullYear(vm.currentDate.getFullYear() - 1);
			vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
			vm.currentMonth = service.getCurrent();
		};
		vm.nextYear = function() {
			vm.currentDate.setFullYear(vm.currentDate.getFullYear() + 1);
			vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
			vm.currentMonth = service.getCurrent();
		};

		vm.showPopup = function() {
			vm.popup = $ionicPopup.show({
				template: "<div class='calendar-title'>" +
					"<div class='title'>" +
						"<div class='month-select' >" +
							"<div ng-click='ctrl.showPopupMonth()'>{{ctrl.currentDate | date : \'MMMM\'}}</div>" +
							"<a ng-click='ctrl.prevMonth()' class='button button-clear button-icon prev'>" + 
								"<i class='ion-chevron-left'></i>" + 
							"</a>" +
							"<a ng-click='ctrl.nextMonth()' class='button button-clear button-icon next'>" +
								"<i class='ion-chevron-right'></i>" +
							"</a>" +
						"</div>" +
						"<div class='year-select'>" +
							"<div ng-click='ctrl.showPopupYear()'>{{ctrl.currentDate | date : \'yyyy\'}}</div>" +
							"<a ng-click='ctrl.prevYear()' class='button button-clear button-icon prev'>" + 
								"<i class='ion-chevron-left'></i>" + 
							"</a>" +
							"<a ng-click='ctrl.nextYear()' class='button button-clear button-icon next'>" +
								"<i class='ion-chevron-right'></i>" +
							"</a>" +
						"</div>" +
					"</div>" + 
						
					"</div>" +
					"<div class='calendar-box'>" +
						"<div class='calendar-weeks' ng-repeat='day in ctrl.weeks'>{{day}}</div>" +
						"<div class='calendar-day' ng-repeat='day in ctrl.daysInMonth' ng-class='{\"today\": day.getTime() == ctrl.today.getTime(), \"selected\": day.getTime() == ctrl.model.getTime(), \"prev-month\": day.getTime() < ctrl.currentMonth.min.getTime(), \"next-month\": day.getTime() > ctrl.currentMonth.max.getTime(), \"min-value\": ctrl.hasMinValue && ctrl.minDateValue.getTime() > day.getTime()}' ng-click='ctrl.select(day)'>{{day.getDate()}}</div>" +
					"</div>",
				cssClass: "datepicker",
				scope: $scope.$new()
			});
		};

		vm.setMonth = function(month) {
			vm.currentDate.setMonth(month);
			vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
			vm.currentMonth = service.getCurrent();

			vm.popupMonth.close();
		};

		
		vm.showPopupMonth = function() {
			vm.months = service.getMonths();

			vm.popupMonth = $ionicPopup.show({
				template: "<div class='calendar-month-box'>" +
						"<div class='calendar-month' ng-repeat='month in ctrl.months track by $index' ng-click='ctrl.setMonth($index)'>{{month}}</div>" +
					"</div>",
				cssClass: "datepicker-month",
				scope: $scope.$new(),
				buttons: [
					{ text: 'Cancel' },
				]
			});
		};

		vm.setYear = function(year) {
			vm.currentDate.setFullYear(year);
			vm.daysInMonth = service.getDaysInMonth(vm.currentDate.getMonth(), vm.currentDate.getFullYear());
			vm.currentMonth = service.getCurrent();

			vm.popupYear.close();
		};

		vm.setYears = function(year) {
			vm.years = service.getYears(year);
		};

		vm.showPopupYear = function() {
			vm.years = service.getYears();

			vm.popupYear = $ionicPopup.show({
				template: "<div class='calendar-title'>" +
						"<div class='title'>{{ctrl.currentDate.getFullYear()}}</div>" + 
						"<a ng-click='ctrl.setYears(ctrl.years[0] - 6)' class='button button-clear button-icon prev'>" + 
							"<i class='ion-chevron-left'></i>" + 
						"</a>" +
						"<a ng-click='ctrl.setYears(ctrl.years[11] + 7)' class='button button-clear button-icon next'>" +
							"<i class='ion-chevron-right'></i>" +
						"</a>" +
					"</div>" +
					"<div class='calendar-year-box'>" +
						"<div class='calendar-year' ng-repeat='year in ctrl.years track by $index' ng-class='{\"current-year\": year === ctrl.currentDate.getFullYear()}' ng-click='ctrl.setYear(year)'>{{year}}</div>" +
					"</div>",
				cssClass: "datepicker-year",
				scope: $scope.$new(),
				buttons: [
					{ text: 'Cancel' },
				]
			});
		};

		vm.closePopup = function() {
			vm.popup.close();
		};

		vm.select = function(date) {
			if(!vm.hasMinValue || date.getTime() >= vm.minDateValue.getTime()) {
				vm.model = date;
				vm.closePopup();
			}
		};
	};

	ionDatepickerCtrl.$inject = ["$scope", "$ionicPopup", "$filter", "ionDatepickerService"];
	
	ionDatepickerLink = function(scope, element, attr, ctrl) {
		var showCalendar = function() {
			ctrl.showPopup();
		};
		element.bind('click', showCalendar);

		if(ctrl.hasMinValue) {
			scope.$watch('ctrl.minDateValue', function(newValue, oldValue) {

				if(newValue) {

					if(newValue.getTime() > ctrl.model) {
						delete ctrl.model;
					}

				}

			});
		}
		
	};

	var ionDatepicker = function() {
		return {
			restrict: "A",
			bindToController: {
				model: "=ngModel",
				minDateValue: "="
			},
			scope: {},
			controllerAs: "ctrl",
			controller: ionDatepickerCtrl,
			link: ionDatepickerLink
		};
	};
	ionDatepicker.$inject = [];


	//******** dateformat directive *********************************************************************************************************************************
	var ionDateFormat = function($window) {
	    return {
	        require: '^ngModel',
	        restrict: 'A',
	        link: function(scope, elm, attrs, ctrl) {
	            var moment = $window.moment;
	            var dateFormat = attrs.ionDateFormat;
	            var defaultDate = attrs.ionDateDefault;
	            console.log("dateFormatdateFormat", dateFormat);

	            attrs.$observe('ionDateFormat', function(newValue) {

	                if (dateFormat == newValue) return;
	                dateFormat = newValue;
	                if (!ctrl.$modelValue && (defaultDate && defaultDate != "") ){
	                	ctrl.$modelValue = $window.moment(defaultDate).format(dateFormat);
	                }else if (!ctrl.$modelValue && (!defaultDate || defaultDate == "") ){
	                	return;
	                }else{
	                	ctrl.$modelValue = new Date(ctrl.$setViewValue);
	                }
	            });

	            ctrl.$formatters.unshift(function(modelValue) {

	                if (!dateFormat) return "";
	                if (modelValue && (defaultDate && defaultDate != "") ){
	                	modelValue = $window.moment(defaultDate).format(dateFormat);
	                }else if (!modelValue && (!defaultDate || defaultDate == "") ){
	                	return;
	                }else{
	                	modelValue = $window.moment(new Date()).format(dateFormat);
	                }

	                var retVal = moment(new Date(modelValue)).format(dateFormat);
	                return retVal;
	            });

	            ctrl.$parsers.unshift(function(viewValue) {
	                var date = moment(viewValue, dateFormat);
	                return (date && date.isValid() && date.year() > 1950 ) ? date.toDate() : "";
	            });
	        }
	    };
	};
	ionDateFormat.$inject = ['$window'];

	angular.module('ionic.datepicker', ['ionic'])
		.provider('$ionDatepicker', ionDatepickerProvider)
		.directive('ionDatepicker', ionDatepicker)
		.factory('ionDatepickerService', ionDatepickerService)
		.directive('ionDateFormat', ionDateFormat);

})(window, window.angular);