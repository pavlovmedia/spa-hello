(function () {

    /**
     * In place to provide a state holder for the directive
     * @constructor
     */
    function D3BarChartCtrl() {
        var vm = this;

        //Bond Meta input examples
        vm.boundMetaVertical = true; //todo remove watch on resize
        vm.boundMetaBarsAllowed = 6;// as a dev i want to the user to specify the charts dimensions so that the chart does not resize on window two options static or dynamic
        vm.boundMetaWidth = 960;
        vm.boundMetaHeight = 500;
        vm.setManually = false;

        // bound input data example
        vm.dataPointOneActive = true;
        vm.dataPointOneName = "Batman";
        vm.dataPointOneValue = 3;
        vm.dataPointOneColor = 'black';

        vm.dataPointTwoActive = true;
        vm.dataPointTwoName = "Joker";
        vm.dataPointTwoValue = 50;
        vm.dataPointTwoColor = 'purple';

        vm.dataPointThreeActive = true;
        vm.dataPointThreeName = "Hulk";
        vm.dataPointThreeValue = 13;
        vm.dataPointThreeColor = 'green';

        vm.dataPointFourActive = true;
        vm.dataPointFourName = "Abomination";
        vm.dataPointFourValue = 30;
        vm.dataPointFourColor = 'red';

        vm.dataPointFiveActive = true;
        vm.dataPointFiveName = "Iron Man";
        vm.dataPointFiveValue = 10;
        vm.dataPointFiveColor = 'gold';

        vm.dataPointSixActive = true;
        vm.dataPointSixName = "Mandarin";
        vm.dataPointSixValue = 19;
        vm.dataPointSixColor = 'orange';

        vm.boundDataSet = [
            {
                name: vm.dataPointOneName,
                value: vm.dataPointOneValue,
                color: vm.dataPointOneColor,
                active: vm.dataPointOneActive
            },
            {
                name: vm.dataPointTwoName,
                value: vm.dataPointTwoValue,
                color: vm.dataPointTwoColor,
                active: vm.dataPointTwoActive
            },
            {
                name: vm.dataPointThreeName,
                value: vm.dataPointThreeValue,
                color: vm.dataPointThreeColor,
                active: vm.dataPointThreeActive
            },
            {
                name: vm.dataPointFourName,
                value: vm.dataPointFourValue,
                color: vm.dataPointFourColor,
                active: vm.dataPointFourActive
            },
            {
                name: vm.dataPointFiveName,
                value: vm.dataPointFiveValue,
                color: vm.dataPointFiveColor,
                active: vm.dataPointFiveActive
            },
            {
                name: vm.dataPointSixName,
                value: vm.dataPointSixValue,
                color: vm.dataPointSixColor,
                active: vm.dataPointSixActive
            }
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
