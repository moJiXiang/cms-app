
//model : models
app.factory('userResource', ['$resource', function ($resource) {

    var Model =  $resource('/rest/users/:id', {id:'@_id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {countNum:true}},
        get   : {method: 'GET', transformResponse: unwrap},
        update: {method: 'PUT', transformResponse: unwrap},
        save: {method: 'POST', transformResponse: unwrap}
    });

    angular.extend(Model.prototype, {
        hasId : function () {
            return !!this._id;
        }
    });
    
    return Model;
}]);


