
//simplely put all services here.


var app = angular.module('cmsAppApp');

app.service('notifierService', [function () {
    //
    this.unread = [];

    this.notify = function (message) {
        this.unread.unshift(message);//push to the beginning of array
    };

    this.dismiss = function (message) {
        this.unread.splice(this.unread.indexOf(message), 1);
    };

    this.dismissAll = function () {
        this.unread = [];
    }
}]);

// app.config(['$http', function ($http) {

// }]);