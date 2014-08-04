'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('CityListCtrl', ['$scope', '$http', '$modal', 'cityResource', 'edituserResource', 'auditingResource',
		function($scope, $http, $modal, cityResource, edituserResource, auditingResource) {
			/**
			 * get all cities and pagination
			 * @return {array}    return cities array
			 */
			cityResource.count({}, function(data) {
				$scope.totalItems = data.result;
				$scope.numPages = Math.round(data.result / 20);
			})
			$scope.maxSize = 5
			$scope.currentPage = 1;

			$scope.pageChanged = function() {

				cityResource.query({
					offset: ($scope.currentPage - 1) * 20
				}, function(citys) {
					console.log(citys);
					// add all citys's id in an array for http request
					var itemids = citys.map(function(city) {
						return city._id
					});
					console.log(itemids);

					auditingResource.query({"items": itemids.join(',')}, function(audits) {
						console.log(audits);
						// var cities = audits.map()
					})

					// angular.forEach(citys, function(city) {
					// 	auditingResource.query({item_id: city._id, cmd: 'getAuditByItemid'}, function(audits) {
					// 		audits.forEach(function(audit) {
					// 			if(audit.en){
					// 				city.audit_en = audit;
					// 			}else{
					// 				city.audit_zh = audit;
					// 			}
					// 		})
					// 	})	
					// })
					$scope.cities = citys;
				});
			}
			/**
			 * typeahead, query by country use mongodb $regex
			 * @return {array}     return city array
			 */
			$scope.getItemByCountry = function(val) {
				if (val) {
					return cityResource.query({
						citiesbycountry: val,
						sort: 'cityname_py'
					}, function(items) {
						$scope.cities = items;
						return [];
					})
				} else {
					return cityResource.query({}, function(items) {
						$scope.cities = items;
						return [];
					})
				}
			};
			/**
			 * typeahead, query by cityname_py use mongodb $regex
			 * @return {array}     return city array
			 */
			$scope.getItem = function(val) {
				if (val) {
					return cityResource.query({
						citiespy: val,
						sort: 'cityname_py'
					}, function(items) {
						$scope.cities = items;
						return [];
					})
				} else {
					return cityResource.query({}, function(items) {
						$scope.cities = items;
						return [];
					})
				}
			};
			/**
			 * get chinese editors
			 * @return {array}    return chinese editors
			 */
			edituserResource.query({
				group: 0,
				type: 1,
				cmd: "listChineseEditors"
			}, function(items) {
				$scope.editusers_zh = items;
			})

			/**
			 * get english editors
			 * @return {array}   return english editors
			 */
			edituserResource.query({
				group: 1,
				type: 1,
				cmd: "listEnglishEditors"
			}, function(items) {
				$scope.editusers_en = items;
			})

			/**
			 * del one city
			 * @param  {string} cityId city's id
			 * @return {boolean}        del success or fail
			 */
			$scope.del = function(cityId) {
				$http.delete('/rest/citys/' + cityId).success(function(data) {
					console.log(data);
				})
			}

			/**
			 * open modal for appoint task to editor
			 * @return {array}
			 */
			$scope.open = function(size, cityname) {
				$scope.cityname = cityname;
				var modalInstance = $modal.open({
					templateUrl: 'myModalContent.html',
					controller: ModalInstanceCtrl,
					size: size,
					resolve: {
						cityname: function() {
							return $scope.cityname;
						}
					}
				});
			};

		}
	])
	.controller('CityDetailCtrl', ['$scope', '$http', '$routeParams', '$location', '$anchorScroll', 'cityResource', 'labelResource',
		function($scope, $http, $routeParams, $location, $anchorScroll, cityResource, labelResource) {
			/**
			 *  scroll to anchor
			 */
			$scope.scrollTo = function(id) {
				$location.hash(id);
				$anchorScroll();
			}
			cityResource.get({
				id: $routeParams.cityId
			}, function(data) {
				console.log(data);
				$scope.city = data;
				var hotflag = data.hot_flag;
				var showflag = data.show_flag;
				$scope.hot_flag = hotflag == '1' ? '是' : '否';
				$scope.show_flag = showflag == '1' ? '是' : '否';
				if (data.masterLabel) {
					labelResource.get({
						id: data.masterLabel
					}, function(data) {
						$scope.masterlabel = data.label;
					})
				}
				labelResource.query({
					city: $routeParams.cityId,
					cmd: 'listByCity'
				}, function(data) {
					$scope.sublabels = data;
				})
			})
		}
	])
	.controller('CityEditCtrl', ["$scope", "$http", "$routeParams", "$location", "$anchorScroll", "cityResource", "labelResource", 'notifierService',
		function($scope, $http, $routeParams, $location, $anchorScroll, cityResource, labelResource, notifierService) {
			/**
			 * scroll to one anchor by id
			 * @param  {string} id DOM id
			 */
			$scope.scrollTo = function(id) {
				$location.hash(id);
				$anchorScroll();
			}
			cityResource.get({
				id: $routeParams.cityId
			}, function(data) {
				console.log(data.en_info);
				$scope.city = data;
				$scope.hotFlagModel = data.hot_flag;
				$scope.showFlagModel = data.show_flag;

				/**
				 *  get masterlabel and sublabels
				 */
				if (data.masterLabel) {
					labelResource.get({
						id: data.masterLabel
					}, function(data) {
						$scope.masterlabel = data.label;
					})
				}
				labelResource.query({
					city: $routeParams.cityId,
					cmd: 'listByCity'
				}, function(data) {
					$scope.sublabels = data;
				})
			})

			$scope.atip = {};
			$scope.addTip = function(tip, items, type) {

				if (!$scope.editMode) {
					type ? $scope.city[type][items].push($scope.atip) : $scope.city[items].push($scope.atip);
				}
				$scope.atip = {};
				$scope.editMode = false;
			}
			$scope.editTip = function(tip, items) {
				$scope.atip = tip;
				$scope.editMode = true;
			}
			$scope.removeTip = function(tip, items) {
				$scope.city[items].splice($scope.city[items].indexOf(tip), 1);
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
				if ($scope.city.subLabel) {
					$scope.city.subLabel.push(labelid);
				} else {
					$scope.city.subLabel = [];
					$scope.city.subLabel.push(labelid);
				}
			}
			/**
			 * save city
			 */
			$scope.save = function() {
				var city = $scope.city;
				console.log(city);
				city.$update().then(function() {
					notifierService.notify({
						type: 'success',
						msg: '更新城市成功！'
					})
				}).catch(function(res) {
					notifierService.notify({
						type: 'danger',
						msg: '更新城市失败！错误码' + res.status
					})
				})
			}

		}
	])
	.controller('CityNewCtrl', ['$scope', "$location", "$anchorScroll",
		function($scope, $location, $anchorScroll) {
			/**
			 * scroll to one anchor by id
			 * @param  {string} id DOM id
			 */
			$scope.scrollTo = function(id) {
				$location.hash(id);
				$anchorScroll();
			}
		}
	]);

var ModalInstanceCtrl = function($scope, $modalInstance, edituserResource, cityname) {
	/**
	 * get chinese editors
	 * @return {array}    return chinese editors
	 */
	edituserResource.query({
		group: 0,
		type: 1,
		cmd: "listChineseEditors"
	}, function(items) {
		console.log(items);
		$scope.editusers_zh = items;
	})

	/**
	 * get english editors
	 * @return {array}   return english editors
	 */
	edituserResource.query({
		group: 1,
		type: 1,
		cmd: "listEnglishEditors"
	}, function(items) {
		$scope.editusers_en = items;
	})
	$scope.cityname = cityname;

	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};