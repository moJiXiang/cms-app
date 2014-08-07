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
	.controller('CityDetailCtrl', ['$scope', '$http', '$routeParams', 'cityResource', 'labelResource',
		function($scope, $http, $routeParams, cityResource, labelResource) {
			
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
	.controller('CityEditCtrl', ["$scope", "$http", "$routeParams", "countryResource", "cityResource", "labelResource", 'notifierService', 'selectCityService',
		function($scope, $http, $routeParams, countryResource, cityResource, labelResource, notifierService, selectCityService) {
			
			cityResource.get({
				id: $routeParams.cityId
			}, function(data) {
				$scope.city = data;
				
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
			$scope.continents = selectCityService.getContinents();
			/**
			 * changeContinent by select directior ng-change
			 * @param  {Object} city      city
			 * @param  {Object} continent name and value
			 */
			$scope.changeContinent = function(continent) {
				$scope.city.continents = continent.name;
			}
			$scope.setCountries = function(continent) {
				var continentcode = continent.value;
				$scope.countries = selectCityService.getCountriesByContinent();
			}
			$scope.changeCountry = function(country) {
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
			 * set coverimage of the city
			 * @param {string} imagename like 121423425.jpg
			 */
			$scope.setCoverImage = function(imagename) {
				$scope.city.coverImageName = imagename;
				$scope.city.$update(function() {
					notifierService.notify({
						type: 'success',
						msg: '设置封面图片成功！'
					})
				}).catch(function(res) {
					notifierService.notify({
						type: 'danger',
						msg: '设置封面图片失败！错误码' + res.status
					})
				})
			}
			/**
			 * delImg iamge of city image array
			 * @param  {string} imagename image's name
			 */
			$scope.delImg = function (imagename) {
				var index = $scope.city.image.indexOf(imagename);
				if (index >= 0) {
					$scope.city.image.splice(index, 1);
				}
				// firstly delete image from serve and upyun
				$http.get('/delCoverImage/'+ $scope.city._id +'/' + imagename).success(function() {
					// then delete image from database
					$scope.city.$update(function() {
						notifierService.notify({
							type: 'success',
							msg: '删除图片成功！'
						})
					}).catch(function(res) {
						notifierService.notify({
							type: 'danger',
							msg: '删除图片失败！错误码' + res.status
						})
					})
				})
			}
			/**
			 * delImg iamge of city backgroundimage array
			 * @param  {string} imagename backgroundimage's name
			 */
			$scope.delBgImg = function (imagename) {
				var index = $scope.city.backgroundimage.indexOf(imagename);
				if (index >= 0) {
					$scope.city.backgroundimage.splice(index, 1);
				}
				// firstly delete image from serve and upyun
				$http.get('/delBackgroundImage/'+ $scope.city._id +'/' + imagename).success(function() {
					// then delete image from database
					$scope.city.$update(function() {
						notifierService.notify({
							type: 'success',
							msg: '删除图片成功！'
						})
					}).catch(function(res) {
						notifierService.notify({
							type: 'danger',
							msg: '删除图片失败！错误码' + res.status
						})
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
	.controller('CityNewCtrl', ['$scope', "cityResource","notifierService",
		function($scope, cityResource, notifierService) {

			$scope.save = function(){
				var city = $scope.city;
				cityResource.save(city, function () {
					notifierService.notify({
						type: 'success',
						msg: 'Add new city success!'
					})
				})
			}
		}
	])
	.controller('FileUploadCtrl', ['$scope', 'FileUploader', '$routeParams', function($scope, FileUploader, $routeParams) {
		$scope.thislist = 'citylist';
		$scope.thisitem = $routeParams.cityId;		
		var uploader = $scope.uploader = new FileUploader({
            url: '/citypic/upload'
        });

		uploader.headers.cityid= $routeParams.cityId;

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
	}])
	.controller('FileUploadCitybgimgCtrl', ['$scope', 'FileUploader','$routeParams', function($scope, FileUploader, $routeParams) {
			$scope.thislist = 'citylist';
			$scope.thisitem = $routeParams.cityId;		
			var uploader = $scope.uploader = new FileUploader({
	            url: '/citypic/upload_background_img'
	        });
			uploader.headers.cityid= $routeParams.cityId;

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
		}])

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
