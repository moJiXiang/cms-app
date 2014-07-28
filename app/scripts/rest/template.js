
//model : models
app.factory('userResource', ['$resource', function ($resource) {
    return $resource('/rest/users/:id', {id:'@id'}, {
        query : {method: 'GET', isArray: true, transformResponse: unwrap},
        count : {method: 'GET', params: {cmd:'count'}},
        get   : {method: 'GET', transformResponse: unwrap}
    });
}]);


