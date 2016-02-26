(function() {
	function HomeCtrl() {
		
	}

	/*
	 * @ngInject
	 */
	function config($stateProvider, $urlRouterProvider) {
		console.log('Configuring shell.home controller');

		$stateProvider.state('shell.home', {
			url: 'home',
			controller: 'HomeCtrl',
			controllerAs: 'vm',
			templateUrl: 'home/templates/home.html'
		});

		// make this the default/fallback URL
		$urlRouterProvider.otherwise('/home');
	}

	var app = require('angular').module('swf.ng.app');
	app.controller('HomeCtrl', HomeCtrl);
	app.config(config);
})();