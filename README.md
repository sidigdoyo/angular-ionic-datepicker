# angular-ionic-datepicker

install from bower
<pre>
bower i --save angular-ionic-datepicker
</pre>

example
<pre>
angular.module('app', ['ionic.datepicker'])
  .controller('ctrl', function() {
    var vm = this;
    vm.model = {};
  });
</pre>
<pre>
&lt;input type="text" name="startDate" ion-datepicker ion-date-format="DD MMMM YYYY" ng-model="vm.model.startDate" /&gt;
&lt;input type="text" name="endDate" ion-datepicker ion-date-format="DD MMM YYYY" min-date-value="vm.model.startDate" ng-model="vm.model.endDate" /&gt;
</pre>

ion-date-format directive using <a href="http://momentjs.com/docs/#/displaying/format/" target="_blank">moment</a> format date
