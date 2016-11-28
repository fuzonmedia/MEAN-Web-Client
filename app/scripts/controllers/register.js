'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the testApp
 */
angular.module('MeanAppWebClient')
  .controller('RegisterCtrl', function ($scope,Notification,AuthService,spinnerService) {
    $scope.Register=function() {
      if($scope.user.username!=="" && $scope.user.password!=="" && $scope.user.name!=="" && $scope.user.country!=="" ){
      //Start spinner
       spinnerService.show('html5spinner');
      AuthService.signup($scope.user).then(function(msg){
      Notification.success({message: 'User Successfully Registered ' , delay: 4000});
      window.location.href='#login';
      },function(msg){
        Notification.error({message: msg , delay: 4000});
      })
      .finally(function(){
        spinnerService.hide('html5spinner');
      });
    }
    else {
        Notification.error({message: 'Please fill all required field :  Name , Username , Password , Country ' , delay: 4000});
    }
    };
  });
