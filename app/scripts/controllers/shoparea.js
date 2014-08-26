'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('ShopareaListCtrl', ['$scope', '$cookies', 'areaResource', function($scope,$cookies, areaResource) {
		/**
		 * get shopareas and pagination
		 */
		areaResource.count({}, function(data) {
			$scope.totalItems = data.result;
    		$scope.currentPage = $cookies.shoparea_currentPage != undefined ? $cookies.shoparea_currentPage : 1;
    		$scope.maxSize     = 5;
            $scope.pageChanged();
        })
		$scope.pageChanged = function() {
            $cookies.shoparea_currentPage = $scope.currentPage;
			areaResource.query({
				city_name: $scope.cityname,
				offset: ($scope.currentPage - 1) * 20,
                sort: "-show_flag"   
			}, function(items) {
				items.forEach(function (item) {
					item.imagenum = item.image.length;
				})
				$scope.shopareas = items;
			})
		}
        $scope.cityname = $cookies.shoparea_cityname;
		$scope.getShopareasByCity = function (val) {
            $cookies.shoparea_cityname = val;
			areaResource.query({city_name: val}, function(data) {
                $scope.totalItems = data.result;
            })
            return areaResource.query({
                city_name: val,
                sort: "-show_flag"   
            }, function(items) {
                items.forEach(function (item) {
                    item.imagenum = item.image.length;
                })
                $scope.shopareas = items;
				return [];
			})
		}
		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
            $scope.cityname = "";
			return areaResource.query({name: val}, function(items) {
				$scope.shopareas = items;
				return [];
			})
		}
	}])
	.controller('ShopareaDetailCtrl', ['$scope', '$routeParams', 'areaResource', 'auditingResource', 'AuditService', function($scope, $routeParams, areaResource, auditingResource, AuditService) {
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;
		})
		/**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.shopareaId, type: 3, en: false}}, function (item) {
            console.log(item);
            $scope.auditmsg = item[0];
            if($scope.auditmsg.auditcomment.length > 0){
                $scope.auditmsg.auditcomment.forEach(function(item) {
                    $scope[item.field] = item.comment;
                })
            }
        })

        $scope.savecomment = function (field, content) {
            AuditService.savecomment(field, content, $scope.auditmsg);
        }           
        /**
         * pass this item
         */
        $scope.passaudit = function () {
            AuditService.passaudit(2, $scope.auditmsg);
        }
        /**
         * unpass this item, send auditing message to editor
         */
        $scope.unpassaudit = function () {
            AuditService.passaudit(-1, $scope.auditmsg);
        }
	}])
	.controller('ShopareaDetailEnCtrl', ['$scope', '$routeParams', 'areaResource', 'auditingResource', 'AuditService', function($scope, $routeParams, areaResource, auditingResource, AuditService) {
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;
		})
		/**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.shopareaId, type: 3, en: true}}, function (item) {
            console.log(item);
            $scope.auditmsg = item[0];
            if($scope.auditmsg.auditcomment.length > 0){
                $scope.auditmsg.auditcomment.forEach(function(item) {
                    $scope[item.field] = item.comment;
                })
            }
        })

        $scope.savecomment = function (field, content) {
            AuditService.savecomment(field, content, $scope.auditmsg);
        }           
        /**
         * pass this item
         */
        $scope.passaudit = function () {
            AuditService.passaudit(2, $scope.auditmsg);
        }
        /**
         * unpass this item, send auditing message to editor
         */
        $scope.unpassaudit = function () {
            AuditService.passaudit(-1, $scope.auditmsg);
        }
	}])
	.controller('ShopareaEditCtrl', ['$scope', '$http', '$routeParams', 'areaResource', 'notifierService', 'selectCityService', 'getUserService', 'AuditService', 'imgUrlService', function($scope, $http, $routeParams, areaResource, notifierService, selectCityService, getUserService, AuditService, imgUrlService) {
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;

            if(shoparea.image_url.length <= 0) {
                $scope.shoparea.image_url = imgUrlService.initImageUrl(shoparea);
            }
			AuditService.getAudit({id: shoparea._id, en: false}, function (items) {
                $scope.audit = items[0];
            });
            /**
             * get this task by attraction's cityid
             */
            AuditService.getTaskEditor({id: shoparea.city_id, type: 3, en: false}, function (items) {
                console.log(items);
                $scope.editor = items[0];
            });
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
            $scope.shoparea.image_url = imgUrlService.delImgUrl(imagename, $scope.shoparea);   
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
        /**
         * changeContinent by select directior ng-change
         * @param  {Object} city      city
         * @param  {Object} continent name and value
         */
        $scope.continents = selectCityService.getContinents();
        $scope.setCountries = function(continent) {
            selectCityService.getCountriesByContinent(continent, function (items) {
            	$scope.countries = items;
            });
        }
        $scope.setCities = function(country) {
            selectCityService.getCitiesByCountry(country, function(items) {
            	$scope.cities = items;
            });
            console.log($scope.cities)
        }
        $scope.changeCity = function (city) {
            $scope.shoparea.city_name = city.cityname;
            $scope.shoparea.city_id = city._id;
        }

		// add shoparea tag
		$scope.addTag = function(tag, tags) {
			$scope.shoparea.tags = tags;
			if(tags.indexOf(tag) < 0){
				$scope.shoparea.tags.push(tag);
			}
			$scope.tag="";
		}

		/**
         * get auditors by type
         */
        getUserService.getUsers({type: 'auditor'}, function (items) {
            $scope.auditors = items;    
        });
        $scope.postAudit = function(){
            AuditService.postAudit({
                audit : $scope.audit,
                editor : $scope.editor,
                auditor : $scope.audit.auditor
            }, function (item) {
                $scope.audit = item;
            })
        }
        $scope.save = function () {
            var shoparea = $scope.shoparea;
            shoparea.$update().then(function () {
                notifierService.notify({
                    type: 'success',
                    msg: 'update shoparea success!'
                })
            }).catch(function () {
                notifierService.notify({
                    type: 'danger',
                    msg: 'update shoparea failed!error:' + res.status
                })
            })
        }
	}])
	.controller('ShopareaEditEnCtrl', ['$scope', '$http', '$routeParams', 'areaResource', 'notifierService', 'selectCityService', 'getUserService', 'AuditService', function($scope, $http, $routeParams, areaResource, notifierService, selectCityService, getUserService, AuditService) {
		/**
		 * get area message
		 * @param  {string} shoparea shoparea id
		 */
		areaResource.get({id: $routeParams.shopareaId}, function(shoparea) {
			$scope.shoparea = shoparea;

			AuditService.getAudit({id: shoparea._id, en: true}, function (items) {
                $scope.audit = items[0];
            });
            /**
             * get this task by attraction's cityid
             */
            AuditService.getTaskEditor({id: shoparea.city_id, type: 3, en: true}, function (items) {
                console.log(items);
                $scope.editor = items[0];
            });
		})

		/**
         * get auditors by type
         */
        getUserService.getUsers({type: 'auditor'}, function (items) {
            $scope.auditors = items;    
        });
        $scope.postAudit = function(){
            AuditService.postAudit({
                audit : $scope.audit,
                editor : $scope.editor,
                auditor : $scope.audit.auditor
            }, function (item) {
                $scope.audit = item;
            })
        }
        $scope.save = function () {
            var shoparea = $scope.shoparea;
            shoparea.$update().then(function () {
                notifierService.notify({
                    type: 'success',
                    msg: 'update shoparea success!'
                })
            }).catch(function () {
                notifierService.notify({
                    type: 'danger',
                    msg: 'update shoparea failed!error:' + res.status
                })
            })
        }

	}])
	.controller('ShopareaNewCtrl', ['$scope', 'areaResource', 'notifierService', 'selectCityService', function($scope, areaResource, notifierService, selectCityService) {
		$scope.shoparea = {};

		/**
         * init select options of cities
         */
        $scope.continents = selectCityService.getContinents();
        $scope.setCountries = function(continent) {
            selectCityService.getCountriesByContinent(continent, function (items) {
                $scope.countries = items;
            });
        }
        $scope.setCities = function(country) {
            selectCityService.getCitiesByCountry(country, function (items) {
                $scope.cities = items;
            });
        }
        $scope.changeCity = function (city) {
            $scope.shoparea.city_name = city.cityname;
            $scope.shoparea.city_id = city._id;
        }
        $scope.save = function(){
            var shoparea = $scope.shoparea;
            areaResource.save(shoparea, function () {
                notifierService.notify({
                    type: 'success',
                    msg: '成功添加新购物区域!'
                })
            })
        }
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