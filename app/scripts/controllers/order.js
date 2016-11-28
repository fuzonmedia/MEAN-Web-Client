'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 */
angular.module('MeanAppWebClient')
  .controller('OrderCtrl', function ($scope,order,spinnerService,$route, Notification) {
    //console.log($route.current.$$route.operation);
    // Order GET operations && DELETE
    if($route.current.$$route.operation==='get'){
    //Start spinner
     spinnerService.show('html5spinner');
    order.getAll().then(function(result){
      $scope.orders=result;
    },function(msg){
    Notification.error({message: msg , delay: 4000});
    })
    .finally(function(){
      spinnerService.hide('html5spinner');
    });

    $scope.deleteOrder=function(id,index){
      if(window.confirm("Are you sure want to delete that order ?"))
      {
        //Start spinner
         spinnerService.show('html5spinner');
        order.delete(id).then(function(result){
          $scope.orders.splice(index,1);
          Notification.success({message: 'Order Successfully Deleted' , delay: 4000});
        },function(msg){
          Notification.error({message: msg , delay: 4000});
        })
        .finally(function(){
          spinnerService.hide('html5spinner');
        });
      }
    };
  }

  // Order POST operation

    if($route.current.$$route.operation==='post'){
      $scope.formAction='Add Order';
      $scope.formActionClick=function(){
        //Start spinner
         spinnerService.show('html5spinner');
        order.post($scope.order).then(function(result){
          Notification.success({message: 'Order Successfully Created' , delay: 4000});
          window.location.href='#order';
        },function(msg){
          Notification.error({message: msg , delay: 4000});
        })
        .finally(function(){
          spinnerService.hide('html5spinner');
        });
      };
    }

  // Order PUT operation

  if($route.current.$$route.operation==='put'){
    $scope.formAction='Update Order';

    // Pull order details
    //Start spinner
     spinnerService.show('html5spinner');
     order.get($route.current.params._id).then(function(result){
      $scope.order=result;
    },function(msg){
      Notification.error({message: msg , delay: 4000});
    })
    .finally(function(){
      spinnerService.hide('html5spinner');
    });


    $scope.formActionClick=function(){
      //Start spinner
       spinnerService.show('html5spinner');
      order.put($scope.order).then(function(result){
        Notification.success({message: 'Order Successfully Updated' , delay: 4000});
        window.location.href='#order';
      },function(msg){
        Notification.error({message: msg , delay: 4000});
      })
      .finally(function(){
        spinnerService.hide('html5spinner');
      });
    };

  }

  });
