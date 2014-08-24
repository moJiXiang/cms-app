'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('AttractionListCtrl', ['$scope', '$cookies', 'attractionResource', function($scope, $cookies, attractionResource) {
		/**
		 * get attractions and pagination
		 */
		attractionResource.count({}, function(data) {
			$scope.totalItems = data.result;
    		$scope.currentPage = $cookies.attr_currentPage != undefined ? $cookies.attr_currentPage : 1;
    		$scope.maxSize     = 5;
            $scope.pageChanged();
        })
		$scope.pageChanged = function() {
            $cookies.attr_currentPage = $scope.currentPage;
            attractionResource.query({
                cityname: $scope.cityname,
                offset: ($scope.currentPage - 1) * 20,
                sort: "-show_flag"
            }, function(items) {
                items.forEach(function (item) {
                    item.imagenum = item.image.length;
                })
                $scope.attractions = items;

            })
		}
        $scope.cityname = $cookies.attr_cityname;

        $scope.getItemByCity = function(val) {
            $cookies.attr_cityname = val;
            attractionResource.count({cityname: val}, function(data) {
                console.log(data.result)
                $scope.totalItems = data.result;
            })
            return attractionResource.query({
                cityname: val,
                sort: "-show_flag"
            }, function(items) {
                items.forEach(function (item) {
                    item.imagenum = item.image.length;
                })
                $scope.attractions = items;
                // prevent err of typeahead `length of null `
                return [];
            })
        }
        $scope.getItem = function(val) {
            $scope.cityname = "";
            return attractionResource.query({name: val}, function(items) {
                console.log(items);
				$scope.attractions = items;
				// prevent err of typeahead `length of null `
				return [];
			})
		}

	}])
	.controller('AttractionDetailCtrl', ['$scope', '$routeParams', 'attractionResource', 'auditingResource', 'AuditService', function($scope, $routeParams, attractionResource, auditingResource, AuditService) {
        /**
         * get attraction message
         */
		attractionResource.get({id: $routeParams.attractionId}, function(data) {
			$scope.attraction = data;
		})
        /**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.attractionId, type: 0, en: false}}, function (item) {
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
    .controller('AttractionDetailEnCtrl', ['$scope', '$routeParams', 'attractionResource', 'auditingResource', 'AuditService', function($scope, $routeParams, attractionResource, auditingResource, AuditService) {

        attractionResource.get({id: $routeParams.attractionId}, function(data) {
            $scope.attraction = data;
        })

        /**
         * get this attraction audit message by attraction id
         */
        auditingResource.query({criteria:{item_id: $routeParams.attractionId, type: 0, en: true}}, function (item) {
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
	.controller('AttractionEditCtrl', ['$scope', '$http' ,'$routeParams', 'attractionResource', 'labelResource', 'notifierService', 'selectCityService', 'seletTagService', 'getUserService', 'AuditService',
        function($scope, $http, $routeParams, attractionResource, labelResource, notifierService, selectCityService, seletTagService, getUserService, AuditService) {
		
		attractionResource.get({id: $routeParams.attractionId}, function(data) {
			$scope.attraction = data;
			/**
			 *  get masterlabel and sublabels of the city
			 */
			if (data.masterLabel) {
				$scope.masterlabel = seletTagService.getMasterLabel(data.masterLabel)
			}
			$scope.sublabels = seletTagService.getItemSublabels($routeParams.attractionId, 'attraction');
            AuditService.getAudit({id: data._id, en: false}, function (items) {
                $scope.audit = items[0];
            });
            /**
             * get this task by attraction's cityid
             */
            console.log(data.cityid)
            AuditService.getTaskEditor({id: data.cityid, type: 0, en: false}, function (items) {
                console.log(items);
                $scope.editor = items[0];
            });
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
    .controller('AttractionEditEnCtrl', ['$scope', '$routeParams', 'attractionResource', 'getUserService', 'AuditService',
     function($scope, $routeParams, attractionResource, getUserService, AuditService) {

        attractionResource.get({id: $routeParams.attractionId}, function(data) {
            $scope.attraction = data;
            AuditService.getAudit({id: data._id, en: true}, function (items) {
                $scope.audit = items[0];
                console.log(items);
            });
            AuditService.getTaskEditor({id: data.cityid, type: 0, en: true}, function (items) {
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
    .controller('AttractionNewCtrl', ['$scope', 'attractionResource', 'notifierService', 'selectCityService', function ($scope, attractionResource, notifierService, selectCityService) {
        $scope.attraction = {};

        $scope.continents = selectCityService.getContinents();
        $scope.changeContinent = function(continent) {
            $scope.attraction.continents = continent.name;
            $scope.attraction.continentscode = continent.value;
        }
        $scope.setCountries = function(continent) {
            selectCityService.getCountriesByContinent(continent, function (items) {
                $scope.countries = items;
            });
        }
        $scope.changeCountry = function(country) {
            $scope.attraction.countryname = country.cn_name;
            $scope.attraction.countrycode = country.code;
        }
        $scope.setCities = function(country) {
            selectCityService.getCitiesByCountry(country, function (items) {
                $scope.cities = items;
            });
        }
        $scope.changeCity = function (city) {
            $scope.attraction.cityname = city.cityname;
            $scope.attraction.cityid = city._id;
        }
        $scope.save = function(){
            var attraction = $scope.attraction;
            attractionResource.save(attraction, function () {
                notifierService.notify({
                    type: 'success',
                    msg: '成功添加新景点!'
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

