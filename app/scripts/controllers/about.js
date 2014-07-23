'use strict';

/**
 * @ngdoc function
 * @name cmsAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cmsAppApp
 */
angular.module('cmsAppApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
