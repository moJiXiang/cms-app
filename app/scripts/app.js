'use strict';

/**
 * @ngdoc overview
 * @name cmsAppApp
 * @description
 * # cmsAppApp
 *
 * Main module of the application.
 */
var app = angular.module('cmsAppApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ngGrid', 'ui.bootstrap','textAngular','angularFileUpload'])

app.factory('authenticationInterceptor', ['$q', '$window', '$location', function($q, $window, $location) {
  return {
    responseError : function(rejection) {
      if (401 == rejection.status) {
        // $location.path('/login');
        $window.location.href = "logon.html";
        return;
      }
      return $q.rejection(rejection);
    }
  }
}]);
  //intercept 401 error
app.config(['$routeProvider', '$locationProvider', '$resourceProvider', '$httpProvider', function ($routeProvider, $locationProvider, $resourceProvider, $httpProvider) {

  $httpProvider.interceptors.push('authenticationInterceptor');

  //configure routeProvider
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    /**
     * country routes
     */
    .when('/countrylist', {
      templateUrl: 'views/country/list.html',
      controller: 'CountryListCtrl'
    })
    /**
     * city routes
     */
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
    .when('/citylist/addnewcity',{
      templateUrl: 'views/city/edit.html',
      controller: 'CityNewCtrl'
    })
    .when('/citylist/:cityId/fileupload',{
      templateUrl: 'views/routes/fileupload.html',
      controller: 'FileUploadCtrl'
    })
    .when('/citylist/:cityId/fileuploadcitybgimg',{
      templateUrl: 'views/routes/fileupload.html',
      controller: 'FileUploadCitybgimgCtrl'
    })
    /**
     * attraction routes
     */
    .when('/attractionlist', {
      templateUrl: 'views/attraction/list.html',
      controller: 'AttractionListCtrl'
    })
    .when('/attractionlist/:attractionId/detail',{
      templateUrl: 'views/attraction/detail.html',
      controller: 'AttractionDetailCtrl'
    })
    .when('/attractionlist/:attractionId/edit',{
      templateUrl: 'views/attraction/edit.html',
      controller: 'AttractionEditCtrl'
    })
    .when('/attractionlist/addnewattraction',{
      templateUrl: 'views/attraction/edit.html',
      controller: 'AttractionNewCtrl'
    })
    .when('/attractionlist/:attractionId/fileupload',{
      templateUrl: 'views/routes/fileupload.html',
      controller: 'AttractionFileuploadCtrl'
    })
    /**
     * restaurant routes
     */
    .when('/restaurantlist', {
      templateUrl: 'views/restaurant/list.html',
      controller: 'RestaurantListCtrl'
    })
    .when('/restaurantlist/:restaurantId/detail',{
      templateUrl: 'views/restaurant/detail.html',
      controller: 'RestaurantDetailCtrl'
    })
    .when('/restaurantlist/:restaurantId/edit',{
      templateUrl: 'views/restaurant/edit.html',
      controller: 'RestaurantEditCtrl'
    })
    .when('/restaurantlist/addnewattraction',{
      templateUrl: 'views/restaurant/edit.html',
      controller: 'RestaurantNewCtrl'
    })
    .when('/restaurantlist/:restaurantId/fileupload',{
      templateUrl: 'views/routes/fileupload.html',
      controller: 'RestaurantFileuploadCtrl'
    })
    /**
     * shop routes
     */
    .when('/shoplist', {
      templateUrl: 'views/shop/list.html',
      controller: 'ShopListCtrl'
    })
    .when('/shoplist/:shopId/detail',{
      templateUrl: 'views/shop/detail.html',
      controller: 'ShopDetailCtrl'
    })
    .when('/shoplist/:shopId/edit',{
      templateUrl: 'views/shop/edit.html',
      controller: 'ShopEditCtrl'
    })
    .when('/shoplist/addnewattraction',{
      templateUrl: 'views/shop/edit.html',
      controller: 'ShopNewCtrl'
    })
    .when('/shoplist/:shopId/fileupload',{
      templateUrl: 'views/routes/fileupload.html',
      controller: 'ShopFileuploadCtrl'
    })
    /**
     * shoparea routes
     */
    .when('/shoparealist', {
      templateUrl: 'views/shoparea/list.html',
      controller: 'ShopareaListCtrl'
    })
    .when('/shoparealist/:shopareaId/detail',{
      templateUrl: 'views/shoparea/detail.html',
      controller: 'ShopareaDetailCtrl'
    })
    .when('/shoparealist/:shopareaId/edit',{
      templateUrl: 'views/shoparea/edit.html',
      controller: 'ShopareaEditCtrl'
    })
    .when('/shoparealist/addnewattraction',{
      templateUrl: 'views/shoparea/edit.html',
      controller: 'ShopareaNewCtrl'
    })
    .when('/shoparealist/:shopareaId/fileupload',{
      templateUrl: 'views/routes/fileupload.html',
      controller: 'ShopareaFileuploadCtrl'
    })
    /**
     * editor routes
     */
    .when('/userlist', {
      templateUrl: 'views/user/user.html',
      controller: 'UserManageCtrl'
    })

    .when('/meta',{
      templateUrl: 'views/meta/meta.html',
      controller: 'metaController'
    })
    .otherwise({
      redirectTo: '/'
    });

  //configure resourceProvider
}]);