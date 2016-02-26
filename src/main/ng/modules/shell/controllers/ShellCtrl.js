(function() {
	function ShellCtrl($window) {
		"ngInject";
		this.$window = $window;

		this.appTitle = 'Hello World!';
	}

	ShellCtrl.prototype.doAlert = function() {
		this.$window.alert('Hey world!');
	};


	/*
	 * @ngInject
	 */
	function config($stateProvider) {
		"ngInject";

		$stateProvider.state('shell', {
			url: '/',
			abstract: true,
			controller: 'ShellCtrl',
			controllerAs: 'vm',
			templateUrl: 'shell/templates/shell.html'
		});
	}

	var app = require('angular').module('swf.ng.app');
	app.controller('ShellCtrl', ShellCtrl);
	app.config(config);
})();