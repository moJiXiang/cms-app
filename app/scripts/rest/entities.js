
var app = angular.module('cmsAppApp');


// models.config(['$resourceProvider', function ($resourceProvider) {
//    // Don't strip trailing slashes from calculated URLs
//    $resourceProvider.defaults.stripTrailingSlashes = false;
//  }]);

var unwrap = function (body) {
    return JSON.parse(body).result;
};

//ATTENTION!! DON'T EDIT, BELOW CODES ARE GENERATED , SEE codegen.js


//model : areas
app.factory('areaResource', ['$resource', function ($resource) {
    return $resource('/rest/areas/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : categories
app.factory('categoryResource', ['$resource', function ($resource) {
    return $resource('/rest/categories/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : paths
app.factory('pathResource', ['$resource', function ($resource) {
    return $resource('/rest/paths/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : tasks
app.factory('taskResource', ['$resource', function ($resource) {
    return $resource('/rest/tasks/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : attractions
app.factory('attractionResource', ['$resource', function ($resource) {
    return $resource('/rest/attractions/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : cities
app.factory('cityResource', ['$resource', function ($resource) {
    return $resource('/rest/cities/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : labels
app.factory('labelResource', ['$resource', function ($resource) {
    return $resource('/rest/labels/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : perms
app.factory('permResource', ['$resource', function ($resource) {
    return $resource('/rest/perms/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : taskquestions
app.factory('taskquestionResource', ['$resource', function ($resource) {
    return $resource('/rest/taskquestions/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : auditings
app.factory('auditingResource', ['$resource', function ($resource) {
    return $resource('/rest/auditings/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : editusers
app.factory('edituserResource', ['$resource', function ($resource) {
    return $resource('/rest/editusers/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : lifetags
app.factory('lifetagResource', ['$resource', function ($resource) {
    return $resource('/rest/lifetags/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : restaurants
app.factory('restaurantResource', ['$resource', function ($resource) {
    return $resource('/rest/restaurants/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : users
app.factory('userResource', ['$resource', function ($resource) {
    return $resource('/rest/users/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : bigtypes
app.factory('bigtypeResource', ['$resource', function ($resource) {
    return $resource('/rest/bigtypes/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : entertainments
app.factory('entertainmentResource', ['$resource', function ($resource) {
    return $resource('/rest/entertainments/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : metas
app.factory('metaResource', ['$resource', function ($resource) {
    return $resource('/rest/metas/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);



//model : shoppings
app.factory('shoppingResource', ['$resource', function ($resource) {
    return $resource('/rest/shoppings/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);


