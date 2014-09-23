'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:CityListCtrl,CityDetailCtrl,CityEditCtrl
 * @description
 * # CityListCtrl,CityDetailCtrl,CityEditCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
	.controller('LabelListCtrl', ['$scope',  '$modal', 'labelResource', function($scope, $modal, labelResource) {
		/**
		 * get labels and pagination
		 */

		labelResource.count({}, function(data) {
			$scope.totalItems = data.result;
    		$scope.currentPage = 1;
    		$scope.maxSize     = 5;
            $scope.pageChanged();
        })
		$scope.pageChanged = function() {
			labelResource.query({
				offset: ($scope.currentPage - 1) * 20,
                sort: "area_name, -show_flag"   
			}, function(items) {
				$scope.labels = items;
			})
		}
		/**
		 * open modal for appoint task to editor
		 * @return {array}
		 */
		$scope.open = function(size, label) {
			$scope.label = label;
			var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: ModalInstanceCtrl,
				size: size,
				resolve: {
					label: function() {
						return label;
					}
				}
			});
		};
	}])

var ModalInstanceCtrl = function($scope, $modalInstance, label, labelResource, notifierService){
	$scope.label = label;
	$scope.save = function(label) {
		console.log(label)
		$scope.label.$update().then(function() {
			notifierService.notify({
				type: 'success',
				msg: '更新label成功！'
			})
			$modalInstance.dismiss('cancel');
		}).catch(function(res) {
			notifierService.notify({
				type: 'danger',
				msg: '更新label失败！错误码' + res.status
			})
		})
	}
}