'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('RestaurantListCtrl', ['$scope', 'restaurantResource', function($scope, restaurantResource) {
		/**
		 * get restaurants and pagination
		 */
		restaurantResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages   = Math.round(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		$scope.pageChanged = function() {
			restaurantResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.restaurants = items;
			})
		}
		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
			return restaurantResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {

				restaurantResource.count({criteria: {'name': {'$regex': val, '$options': 'i'}}}, function(data) {
					$scope.totalItems = data.result;
					$scope.numPages   = Math.round(data.result / 20);
				})
				console.log(items)
				$scope.restaurants = items;
				return [];
			})
		}
	}])
	.controller('RestaurantDetailCtrl', ['$scope', function($scope) {

	}])
	.controller('RestaurantEditCtrl', ['$scope', function($scope) {

	}])
	.controller('RestaurantNewCtrl', ['$scope', function($scope) {

	}])

