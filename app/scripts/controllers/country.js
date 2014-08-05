'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('CountryListCtrl', ['$scope', '$modal', 'countryResource', 'notifierService', function($scope, $modal, countryResource, notifierService) {
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
			countryResource.query({offset: ($scope.currentPage - 1) * 20, sort: "name"}, function(items) {
				console.log(items);
				$scope.countries = items;
			})
		};
		/**
		 * getItem from country model if user delete the input value to null, return all countries
		 * @param  {string} val the value from input of the country page
		 * @return {array}     get countries array
		 */
		$scope.getItemByZhname = function(val) {
			if(val){
				return countryResource.query({ cn_name: val, sort: 'cn_name' }, function(items) {
					$scope.countries = items;
					return [];
				})
			}else{
				return countryResource.query({sort: "name"}, function(items) {
					$scope.countries = items;
					return [];
				})
			}
		}
		/**
		 * getItem from country model if user delete the input value to null, return all countries
		 * @param  {string} val the value from input of the country page
		 * @return {array}     get countries array
		 */
		$scope.getItemByEnname = function(val) {
			if(val){
				return countryResource.query({ name: val, sort: 'name' }, function(items) {
					$scope.countries = items;
					return [];
				})
			}else{
				return countryResource.query({sort: "name"}, function(items) {
					$scope.countries = items;
					return [];
				})
			}
		}
		/**
		 * open a modal, data is country
		 * @param  {string} size    modal size
		 * @param  {Object} country data is country of countrylist
		 */
		$scope.openCountryModal = function(country) {
			// $scope.country = country;
			var modalInstance = $modal.open({
				templateUrl: 'editCountryContent.html',
				controller: editCountryContentCtrl,
				resolve: {
					country: function() {
						// return $scope.country;
						return country;
					}
				}
			});

			modalInstance.result.then(function(country) {
				console.log(country);
				$scope.country = country;
			});
		}
		/**
		 * open a modal to make sure delete
		 * @param  {string} size modal size
		 * @param  {Object} country the country to delete
		 */
		$scope.openDelModal = function(size, country) {
			// $scope.country = country;
			var modalInstance = $modal.open({
				templateUrl: 'delmodal.html',
				controller: delModalCtrl,
				size: size,
				resolve: {
					country: function() {
						// return $scope.country;
						return country;
					},
					countries: function() {
						return $scope.countries;
					}
				}
			});

			modalInstance.result.then(function(country) {
				console.log(country);
				$scope.country = country;
			});
		}
	}]);

var editCountryContentCtrl = function($scope, $modalInstance, country, notifierService) {
	// country if a arguments from modalIntance
	$scope.country  = country;
	var phonecode = country.phonecode;	
	/**
	 * update a country, use promise ,it's just an another style of success and fail callback
	 * @return {[type]} [description]
	 */
	$scope.save = function() {
		//update return promise ,promise has then and catch callback
		country = $scope.country;
		country.$update().then(function () {
			notifierService.notify({
				type: 'success',
				msg: '更新国际区号成功！'
			});
			$modalInstance.close(country);
		}).catch(function (res) {
			notifierService.notify({
				type: 'success',
				msg: '更新国际区号失败！错误码' + res.status
			});
		})
	};

	$scope.cancel = function() {
		// notice phonecode isn't storage into the model,and set phonecode to primary phonecode data
		$scope.country.phonecode = phonecode;
		country = $scope.country;
		$modalInstance.close(country);
	};
};

var delModalCtrl = function($scope, $modalInstance, country, countries, notifierService) {
	$scope.country = country;
	$scope.countries = countries;
	/**
	 * del country ,use country model
	 * @param  {string} countryId country's id
	 */
	$scope.sure = function(country) {
		country.$remove({
			id: country._id
		}).then(function() {
			var index = $scope.countries.indexOf(country);
			$scope.countries.splice(index, 1);
			notifierService.notify({
				type: 'success',
				msg: '删除国家成功'
			});
			$modalInstance.close(country);
		}).catch(function(res) {
			console.log(res);
			notifierService.notify({
				type: 'danger',
				msg: '删除国家失败!错误码' + res.status
			});
		})
	}

	$scope.cancel = function() {
		$modalInstance.close(country);
	}
}