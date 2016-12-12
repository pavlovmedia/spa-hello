(function () {
    function DebugCtrl($state) {
        'ngInject';

        var vm = this;

        // Rack Roles smart table data
        vm.rowCollection = $state.get();

        console.debug(vm.rowCollection);
    }

    function config($stateProvider) {
        'ngInject';

        $stateProvider.state('shell.debug', {
            url: 'debug',
            controller: 'DebugCtrl',
            controllerAs: 'vm',
            templateUrl: 'debug/templates/debug.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('DebugCtrl', DebugCtrl);
    app.config(config);
})();