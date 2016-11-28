'use strict';
// This controller will work as parent controller for listing events
//AppCtrl: Catch broadcasted events to go back once session is invalid
/**
 * @ngdoc function
 * @name testApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the testApp
 */
angular.module('MeanAppWebClient')
  .controller('AppCtrl', function ($scope,AuthService,$rootScope,MENU,$location,spinnerService) {
    $scope.MENU=MENU;
    $rootScope.AuthCheck=AuthService.isAutheticate();

    $scope.userLogout=function(){
      AuthService.logout();
      $rootScope.AuthCheck=false;
      window.location.href='#login';
    };
    $rootScope.$watch('AuthCheck',function(){
      //console.log('changed');
    },true);

    $scope.$on('auth-not-authenticated', function(event) {
      AuthService.logout();
      $rootScope.AuthCheck=false;
      window.location.href='#login';
      spinnerService.hide('html5spinner');
 });
  });
