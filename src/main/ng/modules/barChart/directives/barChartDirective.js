(function(){
    /**
     * generates the tables shown in the import pages
     */
    var barChartDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'barChart/templates/bar-chart-directive.html',
            controller: 'BarChartDirectiveCtrl as vm',
            scope: {}
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('barChartDirective', barChartDirective);
})();