'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the testApp
 */
angular.module('MeanAppWebClient')
  .controller('LoginCtrl', function ($scope,AuthService,$rootScope,spinnerService) {
    $scope.userLogin=function() {
      //console.log($scope.user);
      if($scope.user.username!=="" && $scope.user.password!=="" ){
      //Start spinner
       spinnerService.show('html5spinner');
      //console.log($scope.user);
      AuthService.login($scope.user).then(function(msg){
          $rootScope.AuthCheck=AuthService.isAutheticate();
          window.location.href='#dashboard';
      },function(msg){
        $scope.error=msg;
      })
      .finally(function(){
        spinnerService.hide('html5spinner');
      });
    }
    else {
      $scope.error='Invalid Username / Password';
    }
    };
  });
