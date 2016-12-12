(function() {
	function SelectSampleCtrl() {
		var vm = this;
		
		vm.enumValue = 1;

		// reeled in via vm-safe-src in the template, so can be a resolved promise too
		vm.rowCollection = [
			{
				name: 'Dallas Colo',
				facility: 'PHX-1',
				tenant: 'CCG',
				asn: '1234',
				racks: 1,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-2',
				facility: '13',
				tenant: 'CCG Red',
				asn: '134',
				racks: 2,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-3',
				facility: '1',
				tenant: 'CCGreen',
				asn: '124',
				racks: 34,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-4',
				facility: '14',
				tenant: 'CCG Red',
				asn: '234',
				racks: 19,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-5',
				facility: '1',
				tenant: 'CCGreen',
				asn: '123',
				racks: 18,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-6',
				facility: '4',
				tenant: 'GCC Red',
				asn: '11234',
				racks: 71,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-7',
				facility: '1',
				tenant: 'Green CC',
				asn: '12234',
				racks: 61,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-8',
				facility: '5',
				tenant: 'GCC Red',
				asn: '12334',
				racks: 15,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-9',
				facility: '41',
				tenant: 'Green CC',
				asn: '12344',
				racks: 41,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-10',
				facility: '1',
				tenant: 'GCC Red',
				asn: '1244',
				racks: 361,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			},
			{
				name: 'Dallas-11',
				facility: '1',
				tenant: 'Green CCG',
				asn: '1334',
				racks: 81,
				devices: 1,
				prefixes: 1,
				vlans: 1,
				circuits: 1
			}
		];

	}

	function config($stateProvider, $urlRouterProvider) {
		'ngInject';

		$stateProvider.state('shell.selectsample', {
			url: 'selectsample',
			controller: 'SelectSampleCtrl',
			controllerAs: 'vm',
			templateUrl: 'selectsample/templates/selectsample.html'
		});
	}

	var app = require('angular').module('swf.ng.app');
	app.controller('SelectSampleCtrl', SelectSampleCtrl);
	app.config(config);
})();
