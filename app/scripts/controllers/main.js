'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
  .controller('MainCtrl', ['$scope', 'taskResource', function ($scope, taskResource) {
  		taskResource.query({}, function(items) {
  			console.log(items);
  			$scope.tasks = items;
  		})
  }]);

