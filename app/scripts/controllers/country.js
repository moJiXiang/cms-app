'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('CountryListCtrl', ['$scope', 'countryResource', function($scope, countryResource) {
		/**
	  	 *  pagination 
		 */
		countryResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages  = Math.round(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		
		$scope.pageChanged = function() {
			countryResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.countries = items;
			})
		};

		$scope.getItem = function(val) {
			return countryResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {
				$scope.countries = items;
				return [];
			})
		}
	}]);