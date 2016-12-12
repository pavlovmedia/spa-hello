(function() {
	function HomeCtrl() {
		// stub
	}

	function config($stateProvider, $urlRouterProvider) {
		'ngInject';

		$stateProvider.state('shell.home', {
			url: 'home',
			controller: 'HomeCtrl',
			controllerAs: 'vm',
			templateUrl: 'home/templates/home.html'
		});
	}

	var app = require('angular').module('swf.ng.app');
	app.controller('HomeCtrl', HomeCtrl);
	app.config(config);
})();
