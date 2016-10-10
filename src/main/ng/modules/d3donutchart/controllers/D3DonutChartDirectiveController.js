(function () {

    var $ = require('jquery');

    /**
     * @constructor
     */
    function D3DonutChartDirectiveCtrl($scope, $element, $window) {
        'ngInject';

        var vm = this;
        vm.scope = $scope;
        vm.element = $element;
        vm.window = $window;

        /**
         * Gets the dimensions of the element
         * @returns {{height: (*|jQuery), width: (*|jQuery)}}
         */
        vm.scope.getWindowDimensions = function () {
            return {'h': $(vm.element).height(), 'w': $(vm.element).width()};
        };

        /**
         * Watch the dimensions of the element
         */
        vm.scope.$watch(vm.scope.getWindowDimensions, function (newValue) {
            vm.scope.totalSize = newValue.w * 0.4;
        }, true);

        /**
         * Binds the resize event to scope.apply to get around digest cycle
         */
        angular.element(vm.window).bind('resize', function () {
            vm.scope.$apply();
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3DonutChartDirectiveCtrl', D3DonutChartDirectiveCtrl);
})();
