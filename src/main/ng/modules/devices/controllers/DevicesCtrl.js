(function() {
    function DevicesCtrl() {
    }

    function config($stateProvider, $urlRouterProvider) {
        'ngInject';

        $stateProvider.state('shell.devices', {
            url: 'devices',
            controller: DevicesCtrl,
            controllerAs: 'vm',
            templateUrl: 'devices/templates/devices.html'
        });
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('DevicesCtrl', DevicesCtrl);
    app.config(config);
})();
