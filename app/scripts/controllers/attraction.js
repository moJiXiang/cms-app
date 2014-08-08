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
			$scope.numPages   = Math.ceil(data.result / 20);
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
	.controller('AttractionDetailCtrl', ['$scope', '$routeParams', 'attractionResource', function($scope, $routeParams, attractionResource) {

		attractionResource.get({id: $routeParams.attractionId}, function(data) {
			$scope.attraction = data;
		})
	}])
	.controller('AttractionEditCtrl', ['$scope', '$http' ,'$routeParams', 'attractionResource', 'labelResource', 'notifierService', 'selectCityService', 'seletTagService', function($scope, $http, $routeParams, attractionResource, labelResource, notifierService, selectCityService, seletTagService) {
		
		attractionResource.get({id: $routeParams.attractionId}, function(data) {
			$scope.attraction = data;
			/**
			 *  get masterlabel and sublabels of the city
			 */
			if (data.masterLabel) {
				$scope.masterlabel = seletTagService.getMasterLabel(data.masterLabel)
			}
			$scope.sublabels = seletTagService.getItemSublabels($routeParams.attractionId, 'attraction');
		})
        $scope.setCoverImage = function(imagename) {
            $scope.attraction.coverImageName = imagename;
            $scope.attraction.$update(function() {
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

        $scope.delImg = function (imagename) {
            var index = $scope.attraction.image.indexOf(imagename);
            if (index >= 0) {
                $scope.attraction.image.splice(index, 1);
            }
            // first delete image from serve and upyun
            $http.get('/delUploadImage/'+ $scope.attraction._id +'/' + imagename).success(function() {
                console.log(imagename);
                // then delete image from database
                $scope.attraction.$update(function() {
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
         * changeContinent by select directior ng-change
         * @param  {Object} city      city
         * @param  {Object} continent name and value
         */
        $scope.continents = selectCityService.getContinents();
        $scope.setCountries = function(continent) {
        	console.log(continent);
            $scope.countries = selectCityService.getCountriesByContinent(continent);
            console.log($scope.countries);
        }
        $scope.setCities = function(country) {
            $scope.cities = selectCityService.getCitiesByCountry(country);
            console.log($scope.cities)
        }
        $scope.changeCity = function (city) {
            $scope.attraction.cityname = city.cityname;
            $scope.attraction.cityid = city._id;
        }
		
		// masterlabels and sublabels 
		$scope.masterlabels = seletTagService.getMasterLabels();
		$scope.sublabelitems = seletTagService.getSubLabels();
		$scope.fixMasterlabel = function(label) {
			$scope.attraction.masterLabel = label._id;
		}
		$scope.addSublabel = function(label) {
			console.log($scope.attraction.subLabel);
			if ($scope.attraction.subLabel.indexOf(label._id) < 0) {
				$scope.attraction.subLabel.push(label._id);
			}
			$scope.sublabels.push(label);
		} 
		$scope.delSublabel = function(sublabel) {
			$scope.attraction.subLabel.splice(index, 1);
		}
		/**
		 * save attraction
		 */
		$scope.save = function() {
			var attraction = $scope.attraction;
			attraction.$update().then(function() {
				notifierService.notify({
					type: 'success',
					msg: '更新景点成功！'
				})
			}).catch(function(res) {
				notifierService.notify({
					type: 'danger',
					msg: '更新景点失败！错误码' + res.status
				})
			})
		}

	}])
	.controller('AttractionFileuploadCtrl', ['$scope', 'FileUploader', '$routeParams', function($scope, FileUploader, $routeParams) {
		$scope.thislist = 'attractionlist';
		$scope.thisitem = $routeParams.attractionId;		
		var uploader = $scope.uploader = new FileUploader({
            url: '/postimage'
        });
		uploader.headers.attractionid= $routeParams.attractionId;

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

