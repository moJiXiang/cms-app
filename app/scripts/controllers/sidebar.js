'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular
	.module('cmsAppApp')
	.controller('SidebarCtrl', ['$scope', 'metaResource',
		function($scope, metaResource) {

			metaResource.query({
				criteria: {
					type: 'sidebar-link'
				}
			}, function(links) {
				$scope.links = links
			});
			$scope.addClass = function(i) {
				console.log(i);
				$('#tools li').removeClass('select');
				$('#tools li').eq(i).addClass('select');
			}
		}
	]);

