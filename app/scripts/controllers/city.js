'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
  .controller('CityListCtrl', ['$scope', '$http', '$modal', 'cityResource', 'edituserResource', 'auditingResource', function ($scope, $http, $modal, cityResource, edituserResource, auditingResource) {
  	/**
  	 * get all cities
  	 * @return {array}    return cities array
  	 */
	cityResource.query({}, function(citys) {
		angular.forEach(citys, function(city) {
			auditingResource.query({item_id: city._id, cmd: 'getAuditByItemid'}, function(audits) {
				audits.forEach(function(audit) {
					if(audit.en){
						city.audit_en = audit;
					}else{
						city.audit_zh = audit;
					}
				})
			})	
		})
		$scope.cities = citys;
	});


	/**
	 * get chinese editors
	 * @return {array}    return chinese editors
	 */
	edituserResource.query({group: 0 , type: 1, cmd: "listChineseEditors"}, function(items) {
		$scope.editusers_zh = items;
	})
	/**
	 * get english editors
	 * @return {array}   return english editors
	 */
	edituserResource.query({group: 1, type: 1, cmd: "listEnglishEditors"}, function(items) {
		$scope.editusers_en = items;
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

	/**
	 * del one city
	 * @param  {string} cityId city's id
	 * @return {boolean}        del success or fail
	 */
	$scope.del = function(cityId) {
		$http.delete('/rest/citys/'+cityId).success(function(data) {
			console.log(data);
		})
	}


  }])
  .controller('CityDetailCtrl', ['$scope', '$http', '$routeParams', '$location', '$anchorScroll', 'cityResource','labelResource',function($scope, $http, $routeParams, $location, $anchorScroll, cityResource, labelResource) {
  	/**
	 *  scroll to anchor
  	 */
  	$scope.scrollTo = function(id){
    	$location.hash(id);
    	$anchorScroll();
    }
    cityResource.get({id: $routeParams.cityId}, function(data) {
    	console.log(data);
    	$scope.city = data;
		var hotflag = data.hot_flag;
		var showflag = data.show_flag;
		$scope.hot_flag = hotflag == '1' ? '是' : '否';
		$scope.show_flag = showflag	== '1' ? '是' : '否';
    	if(data.masterLabel){
			labelResource.get({id: data.masterLabel}, function(data) {
				$scope.masterlabel = data.label;
			})
		} 
		labelResource.query({city: $routeParams.cityId, cmd:'listByCity'}, function(data){
			$scope.sublabels = data;
		})
    })
  }])
  .controller('CityEditCtrl', ["$scope", "$http", "$routeParams", "$location", "$anchorScroll","cityResource","labelResource",function($scope, $http, $routeParams, $location, $anchorScroll,cityResource,labelResource) {
  	/**
  	 * scroll to one anchor by id
  	 * @param  {string} id DOM id
  	 */
  	$scope.scrollTo = function(id){
    	$location.hash(id);
    	$anchorScroll();
    }
    $('.textarea').wysihtml5();
    cityResource.get({id: $routeParams.cityId}, function(data) {
    	$scope.city = data;
    	$scope.hotFlagModel  = data.hot_flag;
    	$scope.showFlagModel = data.show_flag;
    	
    	/**
		 *  get masterlabel and sublabels 
		 */
    	if(data.masterLabel){
	    	labelResource.get({id: data.masterLabel}, function(data) {
				$scope.masterlabel = data.label;
			})
    	} 
		labelResource.query({city: $routeParams.cityId, cmd:'listByCity'}, function(data){
			$scope.sublabels = data;
		})
    })

    $scope.atip = {};
  	$scope.addTip = function(tip, items) {

  		if (!$scope.editMode){
  			switch(items){
  				case 'introduce':
  			 		$scope.city.introduce.push($scope.atip);
  					break;
  				case 'tips':
  					$scope.city.tips.push($scope.atip);
  					break;
				case 'traffic':
  					$scope.city.traffic.push($scope.atip);
  					break;
				case 'en_info.introduce':
  			 		$scope.city.en_info.introduce.push($scope.atip);
  					break;
  				case 'en_info.tips':
  					$scope.city.en_info.tips.push($scope.atip);
  					break;
				case 'en_info.traffic':
  					$scope.city.en_info.traffic.push($scope.atip);
  					break;
  			}
  		}
  		$scope.atip = {};
  		$scope.editMode = false;
  	}
  	$scope.editTip = function(tip, items) {
  		$scope.atip = tip;
  		$scope.editMode = true;
  	}
  	$scope.removeTip = function(tip, items) {
		switch (items) {
			case 'introduce':
  				$scope.city.introduce.splice($scope.city.introduce.indexOf(tip),1);
				break;
			case 'tips':
  				$scope.city.tips.splice($scope.city.tips.indexOf(tip),1);
				break;
			case 'traffic':
  				$scope.city.traffic.splice($scope.city.traffic.indexOf(tip),1);
				break;
			case 'en_info.introduce':
  				$scope.city.en_info.introduce.splice($scope.city.en_info.introduce.indexOf(tip),1);
  				break;
			case 'en_info.tips':
  				$scope.city.en_info.tips.splice($scope.city.en_info.tips.indexOf(tip),1);
				break;
			case 'en_info.traffic':
  				$scope.city.en_info.traffic.splice($scope.city.en_info.traffic.indexOf(tip),1);
				break;
		}
  	}

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

	$scope.fixMasterlabel = function(labelid) {
		$scope.city.masterLabel = labelid;
	}
	$scope.addSublabel = function(labelid) {
		if($scope.city.subLabel){
			$scope.city.subLabel.push(labelid);
		}else{
			$scope.city.subLabel = [];
			$scope.city.subLabel.push(labelid);
		}
	}
  }])
.controller('CityNewCtrl',['$scope', "$location", "$anchorScroll", function($scope, $location, $anchorScroll) {
	/**
  	 * scroll to one anchor by id
  	 * @param  {string} id DOM id
  	 */
  	$scope.scrollTo = function(id){
    	$location.hash(id);
    	$anchorScroll();
    }
}]);
