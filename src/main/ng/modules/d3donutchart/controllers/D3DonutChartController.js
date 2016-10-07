(function () {

    /**
     * In place to provide a state holder for the directive
     * @constructor
     */
    function D3DonutChartCtrl() {
        var vm = this;


        //Bond Meta input examples
        vm.boundMetaDonutChartSize = 360;

        // bound input data example
        vm.dataPointOneActive = true;
        vm.dataPointOneName = "Batman";
        vm.dataPointOneValue = 3;

        vm.dataPointTwoActive = true;
        vm.dataPointTwoName = "Joker";
        vm.dataPointTwoValue = 50;

        vm.dataPointThreeActive = true;
        vm.dataPointThreeName = "Hulk";
        vm.dataPointThreeValue = 13;

        vm.dataPointFourActive = true;
        vm.dataPointFourName = "Abomination";
        vm.dataPointFourValue = 30;

        vm.dataPointFiveActive = true;
        vm.dataPointFiveName = "Iron Man";
        vm.dataPointFiveValue = 10;

        vm.dataPointSixActive = true;
        vm.dataPointSixName = "Mandarin";
        vm.dataPointSixValue = 19;

        vm.boundDataSet = [
            {
                name: vm.dataPointOneName,
                value: vm.dataPointOneValue,
                active: vm.dataPointOneActive
            },
            {
                name: vm.dataPointTwoName,
                value: vm.dataPointTwoValue,
                active: vm.dataPointTwoActive
            },
            {
                name: vm.dataPointThreeName,
                value: vm.dataPointThreeValue,
                active: vm.dataPointThreeActive
            },
            {
                name: vm.dataPointFourName,
                value: vm.dataPointFourValue,
                active: vm.dataPointFourActive
            },
            {
                name: vm.dataPointFiveName,
                value: vm.dataPointFiveValue,
                active: vm.dataPointFiveActive
            },
            {
                name: vm.dataPointSixName,
                value: vm.dataPointSixValue,
                active: vm.dataPointSixActive
            }
        ];
    }

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('shell.d3donutChart', {
            url: 'd3donutChart',
            controller: 'D3DonutChartCtrl as vm',
            templateUrl: 'd3donutchart/templates/d3-donut-chart-controller.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3DonutChartCtrl', D3DonutChartCtrl);
    app.config(config);
})();
