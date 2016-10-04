(function () {

    /**
     * In place to provide a state holder for the directive
     * @constructor
     */
    function D3TimeGraphCtrl() {
        var vm = this;

        vm.sourceData = [];
    }

    /**
     * Controller initializer
     */
    D3TimeGraphCtrl.prototype.initialize = function () {
        var vm = this;

        // FIXME test mock data
        vm.addRandomData();
        // vm.sourceData = [[
        //     {x: "1-May-12", y: 58.13},
        //     {x: "30-Apr-12", y: 53.98},
        //     {x: "27-Apr-12", y: 67.00},
        //     {x: "26-Apr-12", y: 89.70},
        //     {x: "25-Apr-12", y: 99.00},
        //     {x: "24-Apr-12", y: 130.28},
        //     {x: "23-Apr-12", y: 166.70},
        //     {x: "20-Apr-12", y: 234.98},
        //     {x: "19-Apr-12", y: 345.44},
        //     {x: "18-Apr-12", y: 443.34},
        //     {x: "17-Apr-12", y: 543.70},
        //     {x: "16-Apr-12", y: 580.13},
        //     {x: "13-Apr-12", y: 605.23},
        //     {x: "12-Apr-12", y: 622.77},
        //     {x: "11-Apr-12", y: 626.20},
        //     {x: "10-Apr-12", y: 628.44},
        //     {x: "9-Apr-12", y: 636.23},
        //     {x: "5-Apr-12", y: 633.68},
        //     {x: "4-Apr-12", y: 624.31},
        //     {x: "3-Apr-12", y: 629.32},
        //     {x: "2-Apr-12", y: 618.63},
        //     {x: "30-Mar-12", y: 599.55},
        //     {x: "29-Mar-12", y: 609.86},
        //     {x: "28-Mar-12", y: 617.62},
        //     {x: "27-Mar-12", y: 614.48},
        //     {x: "26-Mar-12", y: 606.98}
        // ]];
    };

    /**
     * add more random data
     */
    D3TimeGraphCtrl.prototype.addRandomData = function () {
        var vm = this;

        var dateVariance = Math.floor(Math.random() * 50) + 1;
        var randomBoolean = Math.random() >= 0.5;
        var randomNumberOfDays = 200;

        // let's random if we add/remove random days
        if (randomBoolean) {
            dateVariance *= -1;
        }
        randomNumberOfDays += dateVariance;

        var date = new Date();
        var tempData = [];
        var startingPoint = Math.random() * 100000;
        for(var j=0; j<randomNumberOfDays; j++) {
            date.setDate(date.getDate() - 1); // subtract a day
            var dateString = date.toISOString().split('T')[0];

            // the range at which the data can vary below or above the original value
            var variance = Math.random() * 10000;

            var x = dateString;
            var y = startingPoint + Math.random() * variance * 2 - variance;
            tempData.push({x: x, y: y});
        }

        vm.sourceData.push(tempData);
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
