'use strict';

/**
 * @ngdoc overview
 * @name cmsAppApp
 * @description
 * # cmsAppApp
 *
 * Main module of the application.
 */
angular
  .module('cmsAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngGrid',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
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
      .when('/attractionlist', {
        templateUrl: 'views/attraction/list.html',
        controller: 'CityCtrl'
      })
      .when('/restaurantlist', {
        templateUrl: 'views/restaurant/list.html',
        controller: 'CityCtrl'
      })
      .when('/shoplist', {
        templateUrl: 'views/shop/list.html',
        controller: 'CityCtrl'
      })
      .when('/shoparealist', {
        templateUrl: 'views/shoparea/list.html',
        controller: 'CityCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
