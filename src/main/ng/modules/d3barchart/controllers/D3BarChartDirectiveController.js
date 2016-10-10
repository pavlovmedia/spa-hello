(function () {
    var $ = require('jquery');

    /**
     * Watches for window resize then forces a digest cycle
     */
    function D3BarChartDirectiveCtrl($scope, $window) {
        'ngInject';

        var vm = this;
        vm.scope = $scope;
        vm.window = $window;

        /**
         * Binds the resize event to scope.apply to get around digest cycle
         */
        angular.element(vm.window).bind('resize', function () {
            vm.scope.$apply();
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3BarChartDirectiveCtrl', D3BarChartDirectiveCtrl);
})();
