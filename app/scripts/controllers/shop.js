'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('ShopListCtrl', ['$scope', '$cookies', 'shoppingResource', function($scope, $cookies, shoppingResource) {
		/**
		 * get shoppings and pagination
		 */
		shoppingResource.count({}, function(data) {
			$scope.totalItems = data.result;
    		$scope.currentPage = $cookies.shop_currentPage != undefined ? $cookies.shop_currentPage : 1;
    		$scope.maxSize     = 5;
            $scope.pageChanged();
        })
		$scope.pageChanged = function() {
            $cookies.shop_currentPage = $scope.currentPage;
            shoppingResource.query({
                city_name: $scope.cityname,
                offset: ($scope.currentPage - 1) * 20,
                sort: "name, -show_flag"
            }, function(items) {
                items.forEach(function (item) {
                    item.imagenum = item.image.length;
                    item.show_flag = item.show_flag ? 1 : 0;
                })
                $scope.shoppings = items;
            })
		}
        $scope.cityname = $cookies.shop_cityname;
        /**
         * get shops by cityname
         * @param  {string} val value of the input
         */
        $scope.getShopsByCityname = function (val) {
            $cookies.shop_cityname = val;
            shoppingResource.count({city_name: val}, function(data) {
                $scope.totalItems = data.result;
            })
            return shoppingResource.query({
                city_name: val,
                sort: "name, -show_flag"
            }, function (items) {
                items.forEach(function (item) {
                    item.imagenum = item.image.length;
                    item.show_flag = item.show_flag ? 1 : 0;
                })
                $scope.shoppings = items;
                return [];
            })
        }
		/**
		 * search filter
		 */
		$scope.getItem = function(val) {
            $scope.cityname = "";
			return shoppingResource.query({q: val}, function(items) {
				$scope.shoppings = items;
				return [];
			})
		}
	}])
	.controller('ShopDetailCtrl', ['$scope', '$routeParams', 'shoppingResource', 'auditingResource', 'AuditService', function($scope, $routeParams, shoppingResource, auditingResource, AuditService) {
        var shopid = $routeParams.shopId;
        shoppingResource.get({id: shopid}, function(shop) {
            console.log(shop);
            $scope.shop = shop;
        })
        /**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.shopId, type: 2, en: false}}, function (item) {
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
    .controller('ShopDetailEnCtrl', ['$scope', '$routeParams', 'shoppingResource', 'auditingResource', 'AuditService',function($scope, $routeParams, shoppingResource, auditingResource, AuditService) {
        var shopid = $routeParams.shopId;
        shoppingResource.get({id: shopid}, function(shop) {
            console.log(shop);
            $scope.shop = shop;
        })

        /**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.shopId, type: 2, en: true}}, function (item) {
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
	.controller('ShopEditCtrl', ['$scope', '$http' ,'$routeParams', 'shoppingResource', 'notifierService', 'selectCityService', 'AuditService', 'getUserService', 'imgUrlService', function($scope, $http, $routeParams, shoppingResource, notifierService, selectCityService, AuditService, getUserService, imgUrlService) {
        var shopid = $routeParams.shopId;
        
        shoppingResource.get({id: shopid}, function(shop) {
            console.log(shop);
            $scope.shop = shop;
            if(shop.image_url.length <= 0) {
                $scope.shop.image_url = imgUrlService.initImageUrl(shop);
            }
            AuditService.getAudit({id: shop._id, en: false}, function (items) {
                $scope.audit = items[0];
            });
            /**
             * get this task by attraction's cityid
             */
            AuditService.getTaskEditor({id: shop.city_id, type: 2, en: false}, function (items) {
                console.log(items);
                $scope.editor = items[0];
            });
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
            $scope.shop.image_url = imgUrlService.delImgUrl(imagename, $scope.shop);   
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
         * changeContinent by select directior ng-change
         * @param  {Object} city      city
         * @param  {Object} continent name and value
         */
        $scope.continents = selectCityService.getContinents();
        $scope.setCountries = function(continent) {
            $scope.countries = selectCityService.getCountriesByContinent(continent);
        }
        $scope.setCities = function(country) {
            $scope.cities = selectCityService.getCitiesByCountry(country);
            console.log($scope.cities)
        }
        $scope.changeCity = function (city) {
            $scope.shop.city_name = city.cityname;
            $scope.shop.city_id = city._id;
        }

        /**
         * get auditors by type
         */
        getUserService.getUsers({type: 'auditor'}, function (items) {
            $scope.auditors = items;    
        });

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
       
        $scope.addOpenTime = function (opentime) {
            console.log(opentime)
            var item = {
                "desc": '',
                "value": ''
            }
            if(opentime.amtime && opentime.pmtime){

                var timedesc = opentime.amtime.getHours() + ':' + opentime.amtime.getMinutes() + ' am-'+opentime.pmtime.getHours()+":"+opentime.pmtime.getMinutes()+' pm';
                var amval = Math.floor((opentime.amtime.getHours()*60+opentime.amtime.getMinutes())/60);
                var pmval = Math.floor((opentime.pmtime.getHours()*60+opentime.pmtime.getMinutes())/60);
            }else {
                var timedesc = 'close';
                var amval = 'close';
                var pmval = 'close';
            }
            item.desc = opentime.weekday.name + ' ' + timedesc;
            item.value = opentime.weekday.value+'-'+ amval + '-' + pmval;
            console.log(item);
            $scope.shop.open_time.push(item);

        }

        $scope.delOpenTime = function (open_time) {
            var descarr = $scope.shop.open_time.map(function(item) {
                return item.name;
            })
            var idx = descarr.indexOf(open_time.desc);
            $scope.shop.open_time.splice(idx, 1);
        }

        $scope.postAudit = function(){
            AuditService.postAudit({
                audit : $scope.audit,
                editor : $scope.editor,
                auditor : $scope.audit.auditor
            }, function (item) {
                $scope.audit = item;
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
    .controller('ShopEditEnCtrl', ['$scope', '$http' ,'$routeParams', 'shoppingResource', 'notifierService', 'getUserService', 'AuditService', function($scope, $http, $routeParams, shoppingResource, notifierService, getUserService, AuditService) {
        /**
         * get shop message
         */
        shoppingResource.get({id: $routeParams.shopId}, function(shop) {
            $scope.shop = shop;
            AuditService.getAudit({id: shop._id, en: true}, function (items) {
                $scope.audit = items[0];
            });
            /**
             * get this task by attraction's cityid
             */
            AuditService.getTaskEditor({id: shop.city_id, type: 2, en: true}, function (items) {
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

        /**
         * update shop
         */
        $scope.save = function() {
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
	.controller('ShopNewCtrl', ['$scope', 'shoppingResource', 'notifierService', 'selectCityService', function($scope, shoppingResource, notifierService, selectCityService) {
        $scope.shop = {};
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
            $scope.shop.city_name = city.cityname;
            $scope.shop.city_id = city._id;
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
       
        $scope.addOpenTime = function (opentime) {
            console.log(opentime)
            var item = {
                "desc": '',
                "value": ''
            }
            if(opentime.amtime && opentime.pmtime){

                var timedesc = opentime.amtime.getHours() + ':' + opentime.amtime.getMinutes() + ' am-'+opentime.pmtime.getHours()+":"+opentime.pmtime.getMinutes()+' pm';
                var amval = Math.floor((opentime.amtime.getHours()*60+opentime.amtime.getMinutes())/60);
                var pmval = Math.floor((opentime.pmtime.getHours()*60+opentime.pmtime.getMinutes())/60);
            }else {
                var timedesc = 'close';
                var amval = 'close';
                var pmval = 'close';
            }
            item.desc = opentime.weekday.name + ' ' + timedesc;
            item.value = opentime.weekday.value+'-'+ amval + '-' + pmval;
            console.log(item);
            $scope.shop.open_time.push(item);

        }

        $scope.delOpenTime = function (open_time) {
            var descarr = $scope.shop.open_time.map(function(item) {
                return item.name;
            })
            var idx = descarr.indexOf(open_time.desc);
            $scope.shop.open_time.splice(idx, 1);
        }
        $scope.save = function(){
            var shop = $scope.shop;
            shoppingResource.save(shop, function () {
                notifierService.notify({
                    type: 'success',
                    msg: '成功添加新购物点!'
                })
            })
        }
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