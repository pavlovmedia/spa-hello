(function(){
    /**
     * generates the tables shown in the import pages
     */
    var d3TimeGraphDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'd3timegraph/templates/d3-time-graph-directive.html',
            controller: 'D3TimeGraphDirectiveCtrl as vm',
            scope: {},
            bindToController: {
                sourceData: '=',
                type: '=',
                height: '=',
                width: '=',
                showLegend: '='
            }
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('d3TimeGraphDirective', d3TimeGraphDirective);
})();