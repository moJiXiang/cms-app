'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp').controller('FooterCtrl', ['$scope', "$http", '$window', function ($scope,$http,$window) {
	$scope.logout = function(){
		$http.get('/logout').success(function() {
			console.log('登出成功！');
          	$window.location.href = "logon.html";
		})
	}
}]);