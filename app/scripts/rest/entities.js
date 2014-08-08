
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

    var Model =  $resource('/rest/areas/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : categories
app.factory('categoryResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/categories/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : paths
app.factory('pathResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/paths/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : tasks
app.factory('taskResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/tasks/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : attractions
app.factory('attractionResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/attractions/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : cities
app.factory('cityResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/cities/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : labels
app.factory('labelResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/labels/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : perms
app.factory('permResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/perms/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : taskquestions
app.factory('taskquestionResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/taskquestions/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : auditings
app.factory('auditingResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/auditings/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : editusers
app.factory('edituserResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/editusers/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : lifetags
app.factory('lifetagResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/lifetags/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : restaurants
app.factory('restaurantResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/restaurants/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : users
app.factory('userResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/users/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : bigtypes
app.factory('bigtypeResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/bigtypes/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : entertainments
app.factory('entertainmentResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/entertainments/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : metas
app.factory('metaResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/metas/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : countrys
app.factory('countryResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/countrys/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : tasks
app.factory('taskResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/tasks/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);



//model : shoppings
app.factory('shoppingResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/shoppings/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);


