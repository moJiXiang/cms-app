'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('ShopareaListCtrl', ['$scope', 'areaResource', function($scope, areaResource) {
		areaResource.query({}, function(items) {
			console.log(items);
			$scope.shopareas = items;
		})
		/**
		 * get shopareas and pagination
		 */
		areaResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages   = Math.ceil(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		$scope.pageChanged = function() {
			areaResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.shopareas = items;
			})
		}

		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
			return areaResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {
				areaResource.count({criteria: {'name': {'$regex': val, '$options': 'i'}}}, function(data) {
					$scope.totalItems = data.result;
					$scope.numPages   = Math.ceil(data.result / 20);
				})
				$scope.shopareas = items;
				return [];
			})
		}
	}])
	.controller('ShopareaDetailCtrl', ['$scope', function($scope) {

	}])
	.controller('ShopareaEditCtrl', ['$scope', '$routeParams', 'areaResource', "cmspublicfn", function($scope, $routeParams, areaResource, cmspublicfn) {
		$scope.scrollTo = function(id) {
			cmspublicfn.scrollTo(id);
		}
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;
		})
		$scope.addTag = function(tag, tags) {
			$scope.shoparea.tags = tags;
			if(tags.indexOf(tag) < 0){
				$scope.shoparea.tags.push(tag);
			}
			$scope.tag="";
		}
	}])
	.controller('ShopareaNewCtrl', ['$scope', function($scope) {

	}])