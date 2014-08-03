'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp').controller('metaController', ['$scope', '$modal', 'metaResource', function ($scope, $modal, metaResource) {

    $scope.filter = {};

    metaResource.query({}, function (items) {
        $scope.metas = items;
    });

    $scope.query = function () {
        var c = {criteria: {}};
        if ($scope.filter.type) {
            c.criteria.type = $scope.filter.type;
        }
        metaResource.query(c, function (items) {
            $scope.metas = items;
        });
    }

    $scope.newMeta = function () {
        $scope.meta = {};
    }

    metaResource.query({criteria: {type: 'type'}}, function (items) {
        $scope.types = items.map(function (i) {return i.value;});
    });

    $scope.isType = function (t) {
        $scope.meta.type == t.value;
    }

    $scope.save = function () {
        var meta = $scope.meta;
        if (meta._id) {
            meta.$update().then(function (ab) {
                $scope.meta = ab;
            }).catch(function (res) {
                console.log(res);
                //TODO handle failure
            });
        } else {
            metaResource.save(meta, function (item) {
                $scope.metas.unshift(item);
            });
        }
    }

    $scope.editMeta = function(meta) {
        $scope.meta = meta;
    }

    $scope.delMeta = function(meta) {
        meta.$remove({id: meta._id}, function () {
            var idx = $scope.metas.indexOf(meta);
            $scope.metas.splice(idx,1);
        })
    }

}]);