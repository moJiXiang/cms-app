
var app = angular.module('cmsAppApp');

app.controller('notifierController', ['$scope', 'notifierService', function ($scope, notifierService) {

    $scope.unread  = notifierService.unread;
    $scope.current = {};
    $scope.notify = function (msg) {
        var m = {}
        if (msg.err) {
            m = {type: 'error', msg : msg.err};
        } else if (msg.message) {
            m = {type: 'alert', msg : msg.message};
        } else {
            m = {type: 'alert', msg : msg + ''};
        }
        notifierService.dismiss(m);
        $scope.current = m;
    }

    $scope.dismiss = function (msg) {
        notifierService.dismiss(msg)
    };

    $scope.dismissAll = function () {
        notifierService.dismissAll();
    }
}]);