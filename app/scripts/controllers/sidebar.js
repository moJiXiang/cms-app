'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp').controller('SidebarCtrl', ['$scope', 'metaResource',function ($scope, metaResource) {

    metaResource.query({criteria: {type: 'sidebar-link'}}, function (links) {
        $scope.links = links
    });

	$('#tools li').click(function() {
		console.log('sdf');
		$('#tools').find('li').removeClass('select');
		$(this).children('li').addClass('select');
	})
}]);

