'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('AuditListCtrl', ['$scope', '$http', '$routeParams', 'cityResource', 'edituserResource', 'auditingResource',
		function($scope, $http, $routeParams, cityResource, edituserResource, auditingResource) {
			var cityid = $routeParams.cityid,
				type = $routeParams.type;
			auditingResource.query({critiria: {item_city: cityid, type: type}}, function (items) {
				console.log(items);
				$scope.auditings = items;
			})

		}])