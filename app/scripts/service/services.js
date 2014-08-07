
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

app.factory('selectCityService', ['countryResource', 'cityResource', function (countryResource, cityResource) {
    // /**
    //  * default continents
    //  */
    // $scope.continents = [
    //     {name: "亚洲", value: "AS"},
    //     {name: "欧洲", value: "EU"},
    //     {name: "美洲", value: "NA"},
    //     {name: "南美", value: "SA"},
    //     {name: "非洲", value: "AF"},
    //     {name: "大洋洲", value: "OC"}
    // ]
    // var continentsArray = $scope.continents.map(function (item) {
    //     return item.name;
    // })
    // // city.continents maybe null
    // var index = continentsArray.indexOf($scope.city.continents);
    // $scope.continent =　$scope.continents[index];
    // $scope.city.continents = $scope.continent.name;
    // $scope.city.continentscode = $scope.continent.value;
    // /**
    //  * get countries by continentscode
    //  */
    // var continentscode = data.continentscode;
    // countryResource.query({'getCountriesByContient': continentscode}, function(items) {
    //     console.log(items);
    //     $scope.countries = items.map(function (item) {
    //         return {
    //             name: item.cn_name,
    //             countrycode: item.code
    //         }
    //     });
    //     var countriesArray = items.map(function (item) {
    //         return item.code;
    //     })
    //     console.log(countriesArray, $scope.city.countrycode);
    //     var index = countriesArray.indexOf($scope.city.countrycode);
    //     console.log(index);
    //     $scope.country = $scope.countries[index];
    // })
    // /**
    //  * get cities by countrycode
    //  * @type {[type]}
    //  */
    // var countrycode = data.countrycode;
    // cityResource.query({'getCitiesByCountrycode': countrycode}, function(items) {
    //     console.log(items);
    //     $scope.cities = items.map(function (item) {
    //         return item.cityname;
    //     });
    // })
    /***********************************************/
    // var continents = [
    //     {name: "亚洲", value: "AS"},
    //     {name: "欧洲", value: "EU"},
    //     {name: "美洲", value: "NA"},
    //     {name: "南美", value: "SA"},
    //     {name: "非洲", value: "AF"},
    //     {name: "大洋洲", value: "OC"}
    // ]
    // var continentsArray = continents.map(function (item) {
    //     return item.name;
    // })
    return {
        getContinents : function () {
            return [
                    {name: "亚洲", value: "AS"},
                    {name: "欧洲", value: "EU"},
                    {name: "美洲", value: "NA"},
                    {name: "南美", value: "SA"},
                    {name: "非洲", value: "AF"},
                    {name: "大洋洲", value: "OC"}
                ]
        },
        getCountriesByContinent : function (continent) {
            var continentcode = continent.value;
            return countryResource.query({"getCountriesByContinent": continentcode}).map(function (item) {
                return {
                    name : item.cn_name,
                    code : item.code
                }
            });
        },
        getCitiesByCountry : function (country) {
            var countrycode = country.code;
            return  cityResource.query({'getCitiesByCountrycode': countrycode}).map(function (item) {
                return {
                    name : item.cityname,
                    id : item._id
                }
            })
        }
    }
}]);
