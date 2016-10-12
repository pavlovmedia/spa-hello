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
        vm.dataPointOneName = "Batman";
        vm.dataPointOneValue = 3;

        vm.dataPointTwoName = "Joker";
        vm.dataPointTwoValue = 50;

        vm.dataPointThreeName = "Hulk";
        vm.dataPointThreeValue = 13;

        vm.dataPointFourName = "Abomination";
        vm.dataPointFourValue = 30;

        vm.dataPointFiveName = "Iron Man";
        vm.dataPointFiveValue = 10;

        vm.dataPointSixName = "Mandarin";
        vm.dataPointSixValue = 19;

        vm.boundDataSet = [
            {
                name: vm.dataPointOneName,
                value: vm.dataPointOneValue
            },
            {
                name: vm.dataPointTwoName,
                value: vm.dataPointTwoValue
            },
            {
                name: vm.dataPointThreeName,
                value: vm.dataPointThreeValue
            },
            {
                name: vm.dataPointFourName,
                value: vm.dataPointFourValue
            },
            {
                name: vm.dataPointFiveName,
                value: vm.dataPointFiveValue
            },
            {
                name: vm.dataPointSixName,
                value: vm.dataPointSixValue
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
