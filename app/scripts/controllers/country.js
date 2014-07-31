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
		countryResource.query({}, function(items) {
			console.log(items);
			$scope.countries = items;
		})

		/**
	  	 *  pagination 
		 */
		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function() {
			console.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize        = 5;
		$scope.bigTotalItems  = 175;
		$scope.bigCurrentPage = 1;
	}]);