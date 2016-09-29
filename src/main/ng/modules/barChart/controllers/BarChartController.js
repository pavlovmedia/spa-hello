(function() {

    /**
     * In place to provide a state holder for the directive 
     * @constructor
     */
    function BarChartCtrl() {
    }

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('shell.barChart', {
            url: 'barChart',
            //controller: 'BarChartCtrl as vm',
            templateUrl: 'barChart/templates/bar-chart-controller.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('BarChartCtrl', BarChartCtrl);
    app.config(config);
})();
