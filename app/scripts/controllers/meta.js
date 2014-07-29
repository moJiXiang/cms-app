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
    }

    $scope.save = function () {
        if ($scope.edit._id) {
            $scope.edit.$update(function () {
                console.log('success');
            });
        } else {
            metaResource.save($scope.edit, function (item) {
                $scope.metas.unshift(item);
            });
        }
    }

    $scope.editMeta = function(meta) {
        $scope.edit = meta;
    }

    $scope.delMeta = function(meta) {
        meta.$remove({id: meta._id}, function () {
            var idx = $scope.metas.indexOf(meta);
            $scope.metas.splice(idx,1);
        })
    }

}]);