(function() {

    /**
     * In place to provide a state holder for the directive 
     * @constructor
     */
    function D3BarChartCtrl() {
    }

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('shell.d3barChart', {
            url: 'd3barChart',
            //controller: 'BarChartCtrl as vm',
            templateUrl: 'd3BarChart/templates/d3-bar-chart-controller.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3BarChartCtrl', D3BarChartCtrl);
    app.config(config);
})();
