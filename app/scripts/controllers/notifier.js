
var app = angular.module('cmsAppApp');

app.controller('notifierController', ['$scope', '$timeout', 'notifierService', function ($scope, $timeout, notifierService) {
    /**
     * use $timeout to realize auto dismiss the alert after 3000ms
     * @return {[type]} [description]
     */
    $scope.current  = function () {
        $timeout(function() {
            notifierService.dismissAll();
        }, 500, false);
        return notifierService.listUnread();
    };
    
    $scope.dismiss = function (msg) {
        notifierService.dismiss(msg)
    };

    $scope.dismissAll = function () {
        notifierService.dismissAll();
    }
}]);