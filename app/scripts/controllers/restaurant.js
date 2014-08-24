'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('RestaurantListCtrl', ['$scope', '$cookies', 'restaurantResource', function($scope, $cookies, restaurantResource) {
		/**
		 * get restaurants and pagination
		 */
        restaurantResource.count({}, function(data) {
			$scope.totalItems = data.result;

            $scope.currentPage = $cookies.res_currentPage != undefined ? $cookies.res_currentPage : 1;
            $scope.maxSize     = 5;
            $scope.pageChanged();
        })

        $scope.pageChanged = function() {
            $cookies.res_currentPage = $scope.currentPage;
            restaurantResource.query({
                city_name: $scope.cityname,
                offset: ($scope.currentPage - 1) * 20,
                sort: "-show_flag"
            }, function(items) {
                items.forEach(function(item) {
                    item.imagecount = item.image.length;
                })
                $scope.restaurants = items;
            })
        }
        $scope.cityname = $cookies.res_cityname;
        /**
         * search filters
         */
        $scope.getRestaurantsBycity = function (val) {
            $cookies.res_cityname = val;
            restaurantResource.count({city_name: val}, function(data) {
                $scope.totalItems = data.result;
            })
            return restaurantResource.query({
                city_name: val,
                sort: "-show_flag"
            }, function (items) {
                items.forEach(function(item) {
                    item.imagecount = item.image.length;
                })
                $scope.restaurants = items;
                return [];
            })
        }
		$scope.getRestaurant = function(val) {
			return restaurantResource.query({criteria: { value: val }, cmd: "queryByName"}, function(items) {

				restaurantResource.count({criteria: {'name': {'$regex': val, '$options': 'i'}}}, function(data) {
					$scope.totalItems = data.result;
					$scope.numPages   = Math.ceil(data.result / 20);
				})
				$scope.restaurants = items;
				return [];
			})
		}
        $scope.reset = function () {
            restaurantResource.query({}, function(items) {
                items.forEach(function(item) {
                    item.imagecount = item.image.length;
                })
                $cookies.res_cityname = $scope.cityname = '';
                $scope.restaurants = items;
            })
        }
	}])
	.controller('RestaurantDetailCtrl', ['$scope', '$routeParams', 'restaurantResource', 'auditingResource', 'AuditService', function($scope, $routeParams, restaurantResource, auditingResource, AuditService) {
        
        restaurantResource.get({id: $routeParams.restaurantId}, function(data) {
            $scope.restaurant = data;
            console.log(data);
        })
        /**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.restaurantId, type: 1, en: false}}, function (item) {
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
    .controller('RestaurantDetailEnCtrl', ['$scope', '$routeParams', 'restaurantResource', 'auditingResource', 'AuditService', function($scope, $routeParams, restaurantResource, auditingResource, AuditService) {
        
        restaurantResource.get({id: $routeParams.restaurantId}, function(data) {
            $scope.restaurant = data;
        })

        /**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.restaurantId, type: 1, en: true}}, function (item) {
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
	.controller('RestaurantEditCtrl', ['$scope', '$http' ,'$routeParams', 'restaurantResource', 'categoryResource', 'notifierService', 'selectCityService', 'getUserService', 'AuditService', function($scope, $http, $routeParams, restaurantResource, categoryResource, notifierService, selectCityService, getUserService, AuditService) {
        var categoryArr = [];
        restaurantResource.get({id: $routeParams.restaurantId}, function(data) {
            $scope.restaurant = data;
            console.log(data.image_url)
            if(data.image_url.length <= 0) {
                $scope.restaurant.image_url = data.image.map(function(item) {
                    return {
                        "img" : item,
                        "url" : ""
                    }
                })
            console.log($scope.restaurant.image_url)
            }
            $scope.tagsObj = {
                'michilin': false,
                'bestfordinner': false,
                'popular': false,
                'localflag': false
            }
            console.log(data.tags)
            if(data.tags.length > 0){
                data.tags.forEach(function(item) {
                    $scope.tagsObj[item] = true
                })
            }
            categoryArr = $scope.restaurant.category.map(function(item) {
                return item._id;
            })

            AuditService.getAudit({id: data._id, en: false}, function (items) {
                $scope.audit = items[0];
            });
            /**
             * get this task by attraction's id
             */
            AuditService.getTaskEditor({id: data.city_id, type: 1, en: false}, function (items) {
                console.log(items);
                $scope.editor = items[0];
            });
        })
        
        $scope.setCoverImage = function(imagename) {
            $scope.restaurant.cover_image = imagename;
            $scope.restaurant.$update(function() {
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
            var index = $scope.restaurant.image.indexOf(imagename);
            if (index >= 0) {
                $scope.restaurant.image.splice(index, 1);
            }
            // first delete image from serve and upyun
            $http.get('/delUploadImageLife/'+ $scope.restaurant._id +'/' + imagename + '/' + $scope.restaurant.type).success(function() {
                // then delete image from database
                $scope.restaurant.$update(function() {
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

        $scope.addImgUrl = function (img, url) {
            var item = {
                "img" : img,
                "url" : url
            };
            var imgs = $scope.restaurant.image_url.map(function (item) {
                return item.img;
            })
            var idx = imgs.indexOf(img);
            if(idx >= 0){
                $scope.restaurant.image_url.splice(idx, 1, item);
            } else {
                $scope.restaurant.image_url.push(item);
            }
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
            selectCityService.getCitiesByCountry(country, function (items) {
                $scope.cities = items;
            });
        }
        $scope.changeCity = function (city) {
            $scope.restaurant.city_name = city.cityname;
            $scope.restaurant.city_id = city._id;
        }


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
            $scope.restaurant.open_time.push(item);

        }

        $scope.delOpenTime = function (open_time) {
            var descarr = $scope.restaurant.open_time.map(function(item) {
                return item.name;
            })
            var idx = descarr.indexOf(open_time.desc);
            $scope.restaurant.open_time.splice(idx, 1);
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
        /**
         * update restaurant
         */
        $scope.save = function() {
            console.log($scope.restaurant)
            var restaurant = $scope.restaurant;
            var tmpArr = [];
            for(var prop in $scope.tagsObj){
                if($scope.tagsObj[prop] == true){
                    tmpArr.push(prop);
                }
            }
            restaurant.tags = tmpArr;
            restaurant.website = 'http://' + restaurant.website;
            restaurant.$update().then(function () {
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
    .controller('RestaurantEditEnCtrl', ['$scope', '$routeParams', 'restaurantResource', 'AuditService', 'getUserService', function($scope, $routeParams, restaurantResource, AuditService, getUserService) {
        
        restaurantResource.get({id: $routeParams.restaurantId}, function(data) {
            $scope.restaurant = data;
            AuditService.getAudit({id: data._id, en: true}, function (items) {
                $scope.audit = items[0];
            });
            AuditService.getTaskEditor({id: data.city_id, type: 1, en: true}, function (items) {
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
         * update restaurant
         */
        $scope.save = function() {
            console.log($scope.restaurant)
            var restaurant = $scope.restaurant;
            restaurant.$update().then(function () {
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
	.controller('RestaurantNewCtrl', ['$scope', 'selectCityService', 'restaurantResource', 'notifierService', function($scope, selectCityService, restaurantResource, notifierService) {

        $scope.restaurant = {};
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
            selectCityService.getCitiesByCountry(country, function (items) {
                $scope.cities = items;
            });
        }
        $scope.changeCity = function (city) {
            $scope.restaurant.city_name = city.cityname;
            $scope.restaurant.city_id = city._id;
        }
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
            $scope.restaurant.open_time.push(item);

        }

        $scope.delOpenTime = function (open_time) {
            var descarr = $scope.restaurant.open_time.map(function(item) {
                return item.name;
            })
            var idx = descarr.indexOf(open_time.desc);
            $scope.restaurant.open_time.splice(idx, 1);
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
        $scope.save = function(){
            var restaurant = $scope.restaurant;
            restaurantResource.save(restaurant, function () {
                notifierService.notify({
                    type: 'success',
                    msg: '成功添加新餐馆!'
                })
            })
        }
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

