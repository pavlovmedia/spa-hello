(function() {

    /**
     * In place to provide a state holder for the directive 
     * @constructor
     */
    function D3TimeGraphCtrl() {
    }

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
