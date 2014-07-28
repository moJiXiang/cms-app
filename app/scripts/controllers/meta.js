'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp').controller('metaController', ['$scope', '$modal', 'metaResource', function ($scope, $modal, metaResource) {

    metaResource.query({}, function (items) {
        $scope.metas = items;
    });

    $scope.newMeta = function () {
        $scope.edit = {};
        open();
    }

    var open = function () {
        $modal.open({
            templateUrl: 'meta-edit-modal-id',
        });
    }

}]);

