'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('AttractionListCtrl', ['$scope', 'attractionResource', function($scope, attractionResource) {
		/**
		 * get attractions and pagination
		 */
		attractionResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages   = Math.round(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		$scope.pageChanged = function() {
			attractionResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.attractions = items;
			})
		}

		$scope.getItem = function(val) {
			return attractionResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {
				console.log(items);
				$scope.attractions = items;
				// prevent err of typeahead `length of null `
				return [];
			})
		}
	}])
	.controller('AttractionDetailCtrl', ['$scope', '$routeParams', '$location', '$anchorScroll', 'attractionResource', function($scope, $routeParams, $location, $anchorScroll, attractionResource) {
		/**
		 *  scroll to anchor
	  	 */
	  	$scope.scrollTo = function(id){
	    	$location.hash(id);
	    	$anchorScroll();
	    }
		attractionResource.get({id: $routeParams.attractionId}, function(data) {
			$scope.attraction = data;
		})
	}])
	.controller('AttractionEditCtrl', ['$scope', '$routeParams', '$location', '$anchorScroll', 'attractionResource', 'labelResource', function($scope, $routeParams, $location, $anchorScroll, attractionResource, labelResource) {
		/**
		 *  scroll to anchor
	  	 */
	  	$scope.scrollTo = function(id){
	    	$location.hash(id);
	    	$anchorScroll();
	    }
		attractionResource.get({id: $routeParams.attractionId}, function(data) {
			$scope.attraction = data;
			$scope.dayOrNightModel = data.dayornight;
			$scope.checkModel = {
				am: data.am,
				pm: data.pm,
				ev: data.ev
			}
			$scope.recommandModel = data.recommand_flag;
			$scope.indexModel = data.index_flag;
			$scope.showModel = data.show_flag;

			/**
			 *  get masterlabel and sublabels 
			 */
			if(data.masterLabel) {
				labelResource.get({id: data.masterLabel}, function(data) {
					$scope.masterlabel = data.label;
				})
			}
			labelResource.query({attraction: $routeParams.attractionId, cmd:'listByAttraction'}, function(data){
				$scope.sublabels = data;
			})
		})

		/**
	  	 * get masterlabels
	  	 * @return {array}  data is result returned
	  	 */
	  	labelResource.query({
	  		criteria: {
	  			level: '1'
	  		}
	  	}, function(data) {
	  		$scope.masterlabels = [];
	  		angular.forEach(data, function(item) {
	  			var label = {
	  				name: item.label,
	  				_id: item._id
	  			};
	  			$scope.masterlabels.push(label);
	  		});
	  	})

	  	/**
	  	 * get sublabels
	  	 * @return {array}  data is result returned
	  	 */
		labelResource.query({
			criteria: {
				level: '2'
			}
		}, function(data) {
			$scope.sublabelsopts = [];
			angular.forEach(data, function(item) {
				var label = {
					name: item.label,
					_id: item._id
				}
				$scope.sublabelsopts.push(label);
			});
		})
	}])