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
	.controller('ShopareaDetailCtrl', ['$scope', '$routeParams', 'areaResource', function($scope, $routeParams, areaResource) {
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;
		})
	}])
	.controller('ShopareaEditCtrl', ['$scope', '$http', '$routeParams', 'areaResource', 'notifierService', function($scope, $http, $routeParams, areaResource, notifierService) {
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;
		})
		$scope.setCoverImage = function(imagename) {
			$scope.shoparea.cover_image = imagename;
			$scope.shoparea.$update(function() {
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
			var index = $scope.shoparea.image.indexOf(imagename);
			if (index >= 0) {
				$scope.shoparea.image.splice(index, 1);
			}
			// first delete image from serve and upyun
			$http.get('/delareaimg/'+ $scope.shoparea._id +'/' + imagename).success(function() {
				// then delete image from database
				$scope.shoparea.$update(function() {
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
		// add shoparea tag
		$scope.addTag = function(tag, tags) {
			$scope.shoparea.tags = tags;
			if(tags.indexOf(tag) < 0){
				$scope.shoparea.tags.push(tag);
			}
			$scope.tag="";
		}
	}])
	.controller('ShopareaNewCtrl', ['$scope',  function($scope) {

	}])
	.controller('ShopareaFileuploadCtrl', ['$scope', 'FileUploader', '$routeParams', 'areaResource', 'notifierService', function($scope, FileUploader, $routeParams, areaResource, notifierService) {
		// lead turnback button to shoparealist
		$scope.thislist = 'shoparealist';
		$scope.thisitem = $routeParams.shopareaId;		
	

		var uploader = $scope.uploader = new FileUploader({
            url: '/area/upload'
        });

		// get shopareaid ,then get shoparea data, then setCoverImage by shoparea data
		uploader.headers.areaid= $routeParams.shopareaId;
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