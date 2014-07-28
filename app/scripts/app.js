'use strict';

/**
 * @ngdoc overview
 * @name cmsAppApp
 * @description
 * # cmsAppApp
 *
 * Main module of the application.
 */
var app = angular.module('cmsAppApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ngGrid', 'ui.bootstrap'])

app.config(['$routeProvider', '$locationProvider', '$resourceProvider', function ($routeProvider, $locationProvider, $resourceProvider) {

  //configure routeProvider
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/citylist', {
      templateUrl: 'views/city/list.html',
      controller: 'CityListCtrl'
    })
    .when('/citylist/:cityId/detail',{
      templateUrl: 'views/city/detail.html',
      controller: 'CityDetailCtrl'
    })
    .when('/citylist/:cityId/edit',{
      templateUrl: 'views/city/edit.html',
      controller: 'CityEditCtrl'
    })
    .when('/meta',{
      templateUrl: 'views/meta/meta.html',
      controller: 'metaController'
    })
    // .when('/attractionlist', {
    //   templateUrl: 'views/attraction/list.html',
    //   controller: 'CityCtrl'
    // })
    // .when('/restaurantlist', {
    //   templateUrl: 'views/restaurant/list.html',
    //   controller: 'CityCtrl'
    // })
    // .when('/shoplist', {
    //   templateUrl: 'views/shop/list.html',
    //   controller: 'CityCtrl'
    // })
    // .when('/shoparealist', {
    //   templateUrl: 'views/shoparea/list.html',
    //   controller: 'CityCtrl'
    // })
    .otherwise({
      redirectTo: '/'
    });

  //configure resourceProvider
}]);