'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
  .controller('MainCtrl', ['$scope', 'taskResource', 'auditingResource', function ($scope, taskResource, auditingResource) {
  		/**
       * get all tasks and pagination
       * @return {array}    return tasks array
       */
      taskResource.count({}, function(data) {
        $scope.totalItems = data.result;
      })
      $scope.maxSize = 5
      $scope.currentPage = 1;
      $scope.pageChanged = function() {

        taskResource.query({ offset: ($scope.currentPage - 1) * 20 }, function(items) {
    			$scope.tasks = items;
    			items.forEach(function (item) {
    				console.log(item.city_id, item.type);
    				switch(item.type) {
    					case 0 : item.typezh = '景点'; break;
    					case 1 : item.typezh = '餐馆'; break;
    					case 2 : item.typezh = '购物'; break;
    					case 3 : item.typezh = '区域'; break;
    					case 4 : item.typezh = '城市'; break;
    				}
            /**
             * count passed audit in this task
             */
    				auditingResource.count({item_city: item.city_id, type: item.type, status: 2, en: item.en}, function (data) {
    					item.passed = data.result;
    				})
    				

    			})

    		})
      }
  }]);

