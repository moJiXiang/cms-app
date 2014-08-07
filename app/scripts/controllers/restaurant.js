'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('RestaurantListCtrl', ['$scope', 'restaurantResource', function($scope, restaurantResource) {
		/**
		 * get restaurants and pagination
		 */
		restaurantResource.count({}, function(data) {
			$scope.totalItems = data.result;
			$scope.numPages   = Math.ceil(data.result / 20);
		})
		$scope.currentPage = 1;
		$scope.maxSize     = 5;
		$scope.pageChanged = function() {
			restaurantResource.query({offset: ($scope.currentPage - 1) * 20}, function(items) {
				$scope.restaurants = items;
			})
		}
		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
			return restaurantResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {

				restaurantResource.count({criteria: {'name': {'$regex': val, '$options': 'i'}}}, function(data) {
					$scope.totalItems = data.result;
					$scope.numPages   = Math.ceil(data.result / 20);
				})
				console.log(items)
				$scope.restaurants = items;
				return [];
			})
		}
	}])
	.controller('RestaurantDetailCtrl', ['$scope', '$routeParams', 'restaurantResource', function($scope, $routeParams, restaurantResource) {
        
        restaurantResource.get({id: $routeParams.restaurantId}, function(data) {
            $scope.restaurant = data;
        })
	}])
	.controller('RestaurantEditCtrl', ['$scope', '$routeParams', 'restaurantResource', 'categoryResource', 'notifierService', function($scope, $routeParams, restaurantResource, categoryResource, notifierService) {
        var categoryArr = [];
        restaurantResource.get({id: $routeParams.restaurantId}, function(data) {
            $scope.restaurant = data;
            categoryArr = $scope.restaurant.category.map(function(item) {
                return item._id;
            })
        })
        categoryResource.query({criteria:{ type: 1 }}, function(items) {
            console.log(items);
            $scope.categorys = items;
        })
        $scope.delCategory = function(category) {
            var index = categoryArr.indexOf(category._id);
            $scope.restaurant.category.splice(index, 1);
        }
        $scope.addCategory = function(category) {
            console.log(category);
            console.log(categoryArr);
            var index = categoryArr.indexOf(category._id);
            console.log(index);
            if(index < 0) {
                $scope.restaurant.category.push(category);
                categoryArr.push(category._id);
            }
        }
        // date picker
        $scope.amtime = new Date();
        $scope.pmtime = new Date();
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.ismeridian = true;
        // init time picker data
        $scope.weekdays = [
            {
                name: '周一',
                value: '1'
            },
            {
                name: '周二',
                value: '2'
            },
            {
                name: '周三',
                value: '3'
            },
            {
                name: '周四',
                value: '4'
            },
            {
                name: '周五',
                value: '5'
            },
            {
                name: '周六',
                value: '6'
            },
            {
                name: '周七',
                value: '7'
            }
        ] 
        $scope.opentime = {
            weekday : '',
            amtime : '',
            pmtime : ''
        }
        /**
         * update restaurant
         */
        $scope.save = function() {
            var restaurant = $scope.restaurant;
            restaurant.$update.then(function () {
                notifierService.notify({
                    type: 'success',
                    msg: '更新餐馆成功！'
                })
            }).catch(function () {
                notifierService.notify({
                    type: 'danger',
                    msg: '更新餐馆失败！错误码' + res.status
                })
            })
        }
	}])
	.controller('RestaurantNewCtrl', ['$scope', function($scope) {

	}])
	.controller('RestaurantFileuploadCtrl', ['$scope', 'FileUploader', '$routeParams', function($scope, FileUploader, $routeParams) {
		$scope.thislist = 'restaurantlist';
        $scope.thisitem = $routeParams.restaurantId;

		var uploader = $scope.uploader = new FileUploader({
            url: '/postLifeImage'
        });

        uploader.headers.resshopid = $routeParams.restaurantId;
        uploader.headers.type = '1';
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

