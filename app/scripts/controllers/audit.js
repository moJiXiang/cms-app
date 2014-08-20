'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('AuditListCtrl', ['$scope', '$http', '$window', '$routeParams', 'cityResource', 'edituserResource', 'auditingResource',
		function($scope, $http, $window, $routeParams, cityResource, edituserResource, auditingResource) {
			var cityid = $routeParams.cityid,
				type = $routeParams.type,
				en = $routeParams.en;
			auditingResource.count({item_city: cityid, type: type, en: en}, function (data) {
				console.log(data.result)
				$scope.totalItems = data.result;
				$scope.maxSize = 5;
				$scope.currentPage = 1;
				$scope.pageChanged();
			})			
			$scope.pageChanged = function () {

				auditingResource.query({
					item_city: cityid,
					type: type,
					en: en,
					offset: ($scope.currentPage - 1) * 20,
					sort: '-editdate'
				}, function(items) {
					$scope.auditings = items;
				})
			}

			$scope.goToItem = function (item) {
				var type = item.type;
				var href ;
				switch (type) {
					case 0 : href =  "attractionlist/"+ item.item_id + "/detail"; break;
					case 1 : href =  "restaurantlist/"+ item.item_id + "/detail"; break;
					case 2 : href =  "shoplist/"+ item.item_id + "/detail"; break;
					case 3 : href =  "shoparealist/"+ item.item_id + "/detail"; break;
					case 4 : href =  "citylist/"+ item.item_id + "/detail"; break;
				}
				$window.location = '#/'+ href;
			}

		}])