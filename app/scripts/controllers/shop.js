'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('ShopListCtrl', ['$scope', 'shoppingResource', function($scope, shoppingResource) {
		/**
		 * get shoppings and pagination
		 */
		shoppingResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages   = Math.round(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		$scope.pageChanged = function() {
			shoppingResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.shoppings = items;
			})
		}

		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
			return shoppingResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {
				shoppingResource.count({criteria: {'name': {'$regex': val, '$options': 'i'}}}, function(data) {
					$scope.totalItems = data.result;
					$scope.numPages   = Math.round(data.result / 20);
				})
				$scope.shoppings = items;
				return [];
			})
		}
	}])
	.controller('ShopDetailCtrl', ['$scope', function($scope) {

	}])
	.controller('ShopEditCtrl', ['$scope', function($scope) {

	}])
	.controller('ShopNewCtrl', ['$scope', function($scope) {

	}])