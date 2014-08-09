
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
    var cities = [];
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
            return countryResource.query({"getCountriesByContinent": continentcode})
        },
        getCitiesByCountry : function (country) {
            var countrycode = country.code;
            return cityResource.query({'getCitiesByCountrycode': countrycode})
        }
    }
}]);

app.factory('seletTagService', ['labelResource', function (labelResource) {
    return {
        getMasterLabel : function (labelid) {
            return labelResource.get({
                id: labelid
            })
        },
        getItemSublabels : function (itemid, type) {
        	if(type == 'city') {
        		return labelResource.query({city: itemid, cmd: 'listByCity'});
        	}else {
        		return labelResource.query({attraction: itemid, cmd: 'listByAttraction'});
        	}
        },
        getMasterLabels : function () {
            /**
             * get masterlabels
             * @return {array}  data is result returned
             */
            return labelResource.query({
                criteria: {
                   level: '1'
                }
            })
        },

        getSubLabels : function () {
            /**
             * get sublabels
             * @return {array}  data is result returned
             */
            return labelResource.query({
                criteria: {
                    level: '2'
                }
            })
        }
    }
}])

app.factory('getUserService', ['userResource', function (userResource) {
    return {
        getUsers : function (opt, cb) {
            var editorsArr = [];
	        userResource.query({roles: opt.type}, function (items) {
                editorsArr = items.map(function (item) {
                    return {
                        editor_id : item._id,
                        editor_name : item.username
                    }
                })
                cb(editorsArr);
            });
        }
    }
}])

app.factory('getAuditService', ['auditingResource', 'taskResource', function (auditingResource, taskResource) {
    return {
        getAudit : function (opt, cb) {

            auditingResource.query({item_id: opt.id}, function (items) {
                cb(items);
            });
        },
        getTaskEditor : function (opt, cb) {
            taskResource.query({criteria:{city_id: opt.id, type: opt.type, en: opt.en}}, function (items) {
                cb(items);
            });
        }
    }
}])