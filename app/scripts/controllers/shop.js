'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('ShopListCtrl', ['$scope', 'shoppingResource', function($scope, shoppingResource) {
		/**
		 * get shoppings and pagination
		 */
		shoppingResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages   = Math.ceil(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		$scope.pageChanged = function() {
			shoppingResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.shoppings = items;
			})
		}

		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
			return shoppingResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {
				shoppingResource.count({criteria: {'name': {'$regex': val, '$options': 'i'}}}, function(data) {
					$scope.totalItems = data.result;
					$scope.numPages   = Math.ceil(data.result / 20);
				})
				$scope.shoppings = items;
				return [];
			})
		}
	}])
	.controller('ShopDetailCtrl', ['$scope', '$routeParams', 'shoppingResource', function($scope, $routeParams, shoppingResource) {
        var shopid = $routeParams.shopId;
        shoppingResource.get({id: shopid}, function(shop) {
            console.log(shop);
            $scope.shop = shop;
        })
	}])
	.controller('ShopEditCtrl', ['$scope', '$http' ,'$routeParams', 'shoppingResource', 'notifierService', function($scope, $http, $routeParams, shoppingResource, notifierService) {
        var shopid = $routeParams.shopId;
        
        shoppingResource.get({id: shopid}, function(shop) {
            console.log(shop);
            $scope.shop = shop;
        })
        $scope.setCoverImage = function(imagename) {
            $scope.shop.cover_image = imagename;
            $scope.shop.$update(function() {
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
            var index = $scope.shop.image.indexOf(imagename);
            if (index >= 0) {
                $scope.shop.image.splice(index, 1);
            }
            // first delete image from serve and upyun
            $http.get('/delUploadImageLife/'+ $scope.shop._id +'/' + imagename + '/' + $scope.shop.type).success(function() {
                // then delete image from database
                $scope.shop.$update(function() {
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
         * update shop
         */
        $scope.save = function() {
            console.log($scope.shop)
            var shop = $scope.shop;
            shop.$update().then(function () {
                notifierService.notify({
                    type: 'success',
                    msg: '更新购物成功！'
                })
            }).catch(function () {
                notifierService.notify({
                    type: 'danger',
                    msg: '更新购物失败！错误码' + res.status
                })
            })
        }
	}])
	.controller('ShopNewCtrl', ['$scope', function($scope) {

	}])
	.controller('ShopFileuploadCtrl', ['$scope', '$routeParams', 'FileUploader', function($scope, $routeParams, FileUploader) {
		$scope.thislist = 'shoplist';
        $scope.thisitem = $routeParams.shopId;      
		var uploader = $scope.uploader = new FileUploader({
            url: '/postLifeImage'
        });
        uploader.headers.resshopid = $routeParams.shopId;
        uploader.headers.type = '2';
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