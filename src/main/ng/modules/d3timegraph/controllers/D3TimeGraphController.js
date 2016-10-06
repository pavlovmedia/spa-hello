(function () {

    /**
     * In place to provide a state holder for the directive
     * @constructor
     */
    function D3TimeGraphCtrl() {
        var vm = this;

        vm.sourceData = [];
        vm.dataElementsToAdd = 1;
    }

    /**
     * Controller initializer
     */
    D3TimeGraphCtrl.prototype.initialize = function () {
        var vm = this;

        // FIXME test mock data
        vm.addRandomData();
    };

    /**
     * add more random data
     */
    D3TimeGraphCtrl.prototype.addRandomData = function () {
        var vm = this;

        _.times(vm.dataElementsToAdd, function () {

            var dateVariance = Math.floor(Math.random() * 200) + 1;
            var randomBoolean = Math.random() >= 0.5;
            var randomNumberOfDays = 1000;

            // let's random if we add/remove random days
            if (randomBoolean) {
                dateVariance *= -1;
            }
            randomNumberOfDays += dateVariance;

            var date = new Date();
            var tempData = [];
            var startingPoint = Math.random() * 100000;
            for (var j = 0; j < randomNumberOfDays; j++) {
                date.setDate(date.getDate() - 1); // subtract a day
                var dateString = date.toISOString().split('T')[0];

                // the range at which the data can vary below or above the original value
                var variance = Math.random() * 10000;

                var x = dateString;
                var y = startingPoint + Math.random() * variance * 2 - variance;
                tempData.push({x: x, y: y});
            }

            vm.sourceData.push(tempData);
        });
    };

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('shell.d3timegraph', {
            url: 'd3timegraph',
            controller: 'D3TimeGraphCtrl as vm',
            templateUrl: 'd3timegraph/templates/d3-time-graph-controller.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3TimeGraphCtrl', D3TimeGraphCtrl);
    app.config(config);
})();
