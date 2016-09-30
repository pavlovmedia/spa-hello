(function(){
    /**
     * generates the tables shown in the import pages
     */
    var d3BarChartDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'd3BarChart/templates/d3-bar-chart-directive.html',
            controller: 'D3BarChartDirectiveCtrl as vm',
            scope: {}
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('d3BarChartDirective', d3BarChartDirective);
})();