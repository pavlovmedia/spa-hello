(function() {

    /**
     * In place to provide a state holder for the directive 
     * @constructor
     */
    function D3BarChartCtrl() {
        var vm = this;
        
        
        vm.boundDataSet = [
            {name: "Locke",    value:  4},
            {name: "Reyes",    value:  8},
            {name: "Ford",     value: 15},
            {name: "Jarrah",   value: 16},
            {name: "Shephard", value: 23},
            {name: "Kwon",     value: 42}
        ];
        
    }

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('shell.d3barChart', {
            url: 'd3barChart',
            controller: 'D3BarChartCtrl as vm',
            templateUrl: 'd3barchart/templates/d3-bar-chart-controller.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3BarChartCtrl', D3BarChartCtrl);
    app.config(config);
})();
