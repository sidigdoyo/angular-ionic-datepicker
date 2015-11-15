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
	var ionDatepickerService = function($ionDatepicker) {
		var month = [];
		var daysInMonth = [];
		var temp = new Date();
		var _min, _max;

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
			nextMonth: nextMonth,
			prevMonth: prevMonth
		};
	};
	ionDatepickerService.$inject = ["$ionDatepicker"];

	//******** datepicker directive *********************************************************************************************************************************
	ionDatepickerCtrl = function($scope, $ionicPopup, $filter, service) {
		var vm = this;
		vm.hasMinValue = false;

		if(vm.minValue) {
			vm.minValue = new Date(vm.minValue.getFullYear(), vm.minValue.getMonth(), vm.minValue.getDate());
			vm.hasMinValue = true;
		}
		vm.today = service.today();
		vm.weeks = service.getDays();
		vm.currentDate = service.today();

		vm.daysInMonth = service.getDaysInMonth(vm.today.getMonth(), vm.today.getFullYear());
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


		vm.showPopup = function() {
			vm.popup = $ionicPopup.show({
				template: "<div class='calendar-title'>" +
					"<div class='title'>{{ctrl.currentDate | date : \'MMMM yyyy\'}}</div>" + 
						"<a ng-click='ctrl.prevMonth()' class='button button-clear button-icon prev'>" + 
							"<i class='ion-chevron-left'></i>" + 
						"</a>" +
						"<a ng-click='ctrl.nextMonth()' class='button button-clear button-icon next'>" +
							"<i class='ion-chevron-right'></i>" +
						"</a>" +
					"</div>" +
					"<div class='calendar-box'>" +
						"<div class='calendar-weeks' ng-repeat='day in ctrl.weeks'>{{day}}</div>" +
						"<div class='calendar-day' ng-repeat='day in ctrl.daysInMonth' ng-class='{\"today\": day.getTime() == ctrl.today.getTime(), \"selected\": day.getTime() == ctrl.model.getTime(), \"prev-month\": day.getTime() < ctrl.currentMonth.min.getTime(), \"next-month\": day.getTime() > ctrl.currentMonth.max.getTime(), \"min-value\": ctrl.hasMinValue && ctrl.minValue.getTime() > day.getTime()}' ng-click='ctrl.select(day)'>{{day.getDate()}}</div>" +
					"</div>",
				cssClass: "datepicker",
				scope: $scope.$new()
			});
		};

		vm.closePopup = function() {
			vm.popup.close();
		};

		vm.select = function(date) {
			if(!vm.hasMinValue || date.getTime() >= vm.minValue.getTime()) {
				vm.model = date;
				vm.closePopup();
			} else {

				var alertPopup = $ionicPopup.alert({
					title: 'Alert',
					template: 'Selected date cannot be less than '+ $filter('date')(vm.minValue, 'dd MMMM yyyy')
				});

				alertPopup.then(function(res) {
					
				});
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
			scope.$watch('ctrl.minValue', function(newValue, oldValue) {

				if(newValue.getTime() > ctrl.model) {
					ctrl.showPopup();
				}

			});
		}
		
	};

	var ionDatepicker = function() {
		return {
			restrict: "A",
			bindToController: {
				model: "=ngModel",
				minValue: "="
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

	            attrs.$observe('ionDateFormat', function(newValue) {
	                if (dateFormat == newValue || !ctrl.$modelValue) return;
	                dateFormat = newValue;
	                ctrl.$modelValue = new Date(ctrl.$setViewValue);
	            });

	            ctrl.$formatters.unshift(function(modelValue) {
	                if (!dateFormat || !modelValue) return "";
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