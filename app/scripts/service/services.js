
//simplely put all services here.


var app = angular.module('cmsAppApp');

// app.factory('authenticationInterceptor', function($q, $window, $location) {
//     return {
//       responseError : function(rejection) {
//         if (401 == rejection.status) {
//             // $location.path('/login');
//             $window.location.href = "login.html";
//             return;
//         }
//         return $q.rejection(rejection);
//       }
//     }
// });

app.factory('notifierService', [function () {

    var unread = [];
    
    return  {
        /**
         * notify, alert message that response user's event,maybe success or error
         * @param  {Object} msg response Object
         */
        notify : function (message) {
            unread.unshift(message);//push to the beginning of array
            console.log(unread);
        },

        dismiss : function (index) {
            unread.splice(index, 1);
        },

        dismissAll : function () {
            unread = [];
            return unread;
        },

        listUnread : function () {
            return unread;
        }
    }
}]);
app.factory('cmspublicfn', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
    return {
        scrollTo : function(id) {
            $location.hash(id);
            $anchorScroll();
        }
    }
}]);
// app.config(['$http', function ($http) {

// }]);