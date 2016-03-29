(function() {
	function ShellCtrl($state) {
		"ngInject";
		var vm = this;

		vm.appTitle = 'Hello World!';
		vm.stateName = $state.current.name;

		console.log(vm.stateName);
	}

	ShellCtrl.prototype.doAlert = function() {

	};


	/*
	 * @ngInject
	 */
	function config($stateProvider, $urlRouterProvider) {
		"ngInject";

		$stateProvider.state('shell', {
			url: '/',
			abstract: true,
			controller: 'ShellCtrl',
			controllerAs: 'vm',
			templateUrl: 'shell/templates/shell.html'
		});

		// make this the default/fallback URL
		$urlRouterProvider.otherwise('/home');
	}

	var app = require('angular').module('swf.ng.app');
	app.controller('ShellCtrl', ShellCtrl);
	app.config(config);
})();