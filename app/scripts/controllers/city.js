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
				$scope.numPages = Math.ceil(data.result / 20);
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

					auditingResource.query({"items": itemids.join(',')}, function(audits) {
						console.log(audits);
						var cities = citys.forEach(function(city) {
							var id = city._id;
							audits.forEach(function(audit) {
								var item_id = audit.item_id;
								if(id == item_id) {
									if(audit.en) {
										city.audit_en = audit;
									} else {
										city.audit_zh = audit;
									}
								}
							})
						})
					})

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
			$scope.del = function(city) {
				$http.delete('/rest/citys/' + cityId).success(function(data) {
					console.log(data);
				})
			}

			/**
			 * open modal for appoint task to editor
			 * @return {array}
			 */
			$scope.open = function(size, city) {
				$scope.city = city;
				var modalInstance = $modal.open({
					templateUrl: 'myModalContent.html',
					controller: ModalInstanceCtrl,
					size: size,
					resolve: {
						city: function() {
							return city;
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
	.controller('CityEditCtrl', ["$scope", "$http", "$routeParams", "$location", "$anchorScroll", "countryResource", "cityResource", "labelResource", 'notifierService',
		function($scope, $http, $routeParams, $location, $anchorScroll, countryResource, cityResource, labelResource, notifierService) {
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
				$scope.city = data;
				/**
				 * default continents
				 */
				$scope.continents = [
					{name: "亚洲", value: "AS"},
					{name: "欧洲", value: "EU"},
					{name: "美洲", value: "NA"},
					{name: "南美", value: "SA"},
					{name: "非洲", value: "AF"},
					{name: "大洋洲", value: "OC"}
				]
				var continentsArray = $scope.continents.map(function (item) {
					return item.name;
				})
				// city.continents maybe null
				var index = continentsArray.indexOf($scope.city.continents)
				$scope.continent =　$scope.continents[index];
				$scope.city.continents = $scope.continent.name;
				$scope.city.continentscode = $scope.continent.value;
				/**
				 * get countries by continentscode
				 */
				var continentscode = data.continentscode;
				countryResource.query({'getCountriesByContient': continentscode}, function(items) {
					console.log(items);
					$scope.countries = items.map(function (item) {
						return {
							name: item.cn_name,
							countrycode: item.code
						}
					});
					var countriesArray = items.map(function (item) {
						return item.code;
					})
					console.log(countriesArray, $scope.city.countrycode);
					var index = countriesArray.indexOf($scope.city.countrycode);
					console.log(index);
					$scope.country = $scope.countries[index];
				})
				/**
				 * get cities by countrycode
				 * @type {[type]}
				 */
				var countrycode = data.countrycode;
				cityResource.query({'getCitiesByCountrycode': countrycode}, function(items) {
					console.log(items);
					$scope.cities = items.map(function (item) {
						return item.cityname;
					});
				})
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
			/**
			 * changeContinent by select directior ng-change
			 * @param  {Object} city      city
			 * @param  {Object} continent name and value
			 */
			$scope.changeContinent = function(city, continent) {
				$scope.city = city;
				$scope.city.continents = continent.name;
				$scope.city.continentscode = continent.value;
			}
			$scope.setCountries = function(continent) {
				var continentcode = continent.value;
				countryResource.query({'getCountriesByContient': continentcode}, function(items) {
					console.log(items);
					$scope.countries = items.map(function(item) {
						return {
							name: item.cn_name,
							countrycode: item.code
						}
					});
				})
			}
			$scope.changeCountry = function(city, country) {
				$scope.city = city;
				$scope.city.countryname = country.name;
				$scope.city.countrycode = country.countrycode;
			}
			$scope.setCities = function(country) {
				var countrycode = country.countrycode;
				cityResource.query({'getCitiesByCountrycode': countrycode}, function(items) {
					$scope.cities = items.map(function(item) {
						return item.cityname;
					})
				})
			}
			/**
			 * edit tips, introduces, traffic, these are array data
			 */
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
				console.log(labelid);
				$scope.city.masterLabel = labelid;
			}
			$scope.addSublabel = function(labelid, sublabels) {
				$scope.sublabels = sublabels;
				if ($scope.city.subLabel.indexOf(labelid) < 0) {
					$scope.city.subLabel.push(labelid);
					labelResource.get({
						id: labelid
					}, function(data) {
						console.log(data);
						$scope.sublabels.push(data);
					})
				} 
				// else {
				// 	$scope.city.subLabel = [];
				// 	$scope.city.subLabel.push(labelid);
				// 	labelResource.get({
				// 		id: labelid
				// 	}, function(data) {
				// 		console.log(data);
				// 		$scope.sublabels.push(data);
				// 	})
				// }
			} 
			$scope.delSublabel = function(sublabel, sublabels) {
				console.log(sublabel);
				var index = $scope.city.subLabel.indexOf(sublabel._id);
				$scope.city.subLabel.splice(index, 1);
				$scope.sublabels = sublabels;
				$scope.sublabels.splice(index, 1);
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
		$scope.test = '121213';
			$scope.scrollTo = function(id) {
				$location.hash(id);
				$anchorScroll();
			}
		}
	])
	.controller('FileUploadCtrl', ['$scope', 'FileUploader', function($scope, FileUploader) {
		$scope.thislist = 'citylist';
		var uploader = $scope.uploader = new FileUploader({
            url: '/citypic/upload'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            console.info($scope.uploader.queue)
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
	}]);
	.controller('FileUploadCitybgimgCtrl', ['$scope', 'FileUploader', function($scope, FileUploader) {
			$scope.thislist = 'citylist';
			var uploader = $scope.uploader = new FileUploader({
	            url: 'upload.php'
	        });

	        // FILTERS

	        uploader.filters.push({
	            name: 'imageFilter',
	            fn: function(item /*{File|FileLikeObject}*/, options) {
	                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	            }
	        });

	        // CALLBACKS

	        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
	            console.info('onWhenAddingFileFailed', item, filter, options);
	        };
	        uploader.onAfterAddingFile = function(fileItem) {
	            console.info('onAfterAddingFile', fileItem);
	            console.info($scope.uploader.queue)
	        };
	        uploader.onAfterAddingAll = function(addedFileItems) {
	            console.info('onAfterAddingAll', addedFileItems);
	        };
	        uploader.onBeforeUploadItem = function(item) {
	            console.info('onBeforeUploadItem', item);
	        };
	        uploader.onProgressItem = function(fileItem, progress) {
	            console.info('onProgressItem', fileItem, progress);
	        };
	        uploader.onProgressAll = function(progress) {
	            console.info('onProgressAll', progress);
	        };
	        uploader.onSuccessItem = function(fileItem, response, status, headers) {
	            console.info('onSuccessItem', fileItem, response, status, headers);
	        };
	        uploader.onErrorItem = function(fileItem, response, status, headers) {
	            console.info('onErrorItem', fileItem, response, status, headers);
	        };
	        uploader.onCancelItem = function(fileItem, response, status, headers) {
	            console.info('onCancelItem', fileItem, response, status, headers);
	        };
	        uploader.onCompleteItem = function(fileItem, response, status, headers) {
	            console.info('onCompleteItem', fileItem, response, status, headers);
	        };
	        uploader.onCompleteAll = function() {
	            console.info('onCompleteAll');
	        };

	        console.info('uploader', uploader);
		}]);

var ModalInstanceCtrl = function($scope, $modalInstance, edituserResource, city) {
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
	$scope.city = city;

	/**
	 * apoint task to one editor
	 */
	$scope.task = {};
	$scope.qq = 30;
	$scope.sendtask = function(task) {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
