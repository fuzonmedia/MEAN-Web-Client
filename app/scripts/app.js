'use strict';

/**
 * @ngdoc overview
 * @name testApp
 * @description
 * # testApp
 *
 * Main module of the application.
 */
angular
  .module('MeanAppWebClient', [
    'ngResource',
    'ngRoute',
    'angularSpinners',
    'ui-notification'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login',
        auth:false
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register',
        auth:false
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        auth: true
      })
      .when('/order', {
        templateUrl: 'views/orderlist.html',
        controller: 'OrderCtrl',
        controllerAs: 'order',
        auth: true,
        operation : 'get'
      })
      .when('/order/:_id', {
        templateUrl: 'views/orderform.html',
        controller: 'OrderCtrl',
        controllerAs: 'order',
        auth: true,
        operation : 'put'
      })
      .when('/neworder', {
        templateUrl: 'views/orderform.html',
        controller: 'OrderCtrl',
        controllerAs: 'order',
        auth: true,
        operation : 'post'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(NotificationProvider) {
    NotificationProvider.setOptions({ delay: 10000, startTop: 40, startRight: 40, verticalSpacing: 40, horizontalSpacing: 40, positionX: 'right', positionY: 'top' });
  })
  .constant('API_ENDPOINT',{
    LOCAL_TOKEN_KEY: 'TokenKeyByFuzonmedia',
    url: 'https://rest-node-app.herokuapp.com/',
    signup: 'signup',
    login: 'authenticate',
    order: 'order'
  })
  .constant('MENU',{
    LOGGEDIN: [{name: 'Dashboard',url:'',child:[{name:'Dashboard',url:'/dashboard'},{name:'Dashboard2',url:'/dashboard2'}] },{name: 'Order',url:'' ,child:[{name:'List',url:'/order'},{name:'New',url:'/neworder'}]},{name: 'API',url:'/apidetails' }]
  })
  .service('AuthService',function($q,$http,API_ENDPOINT){
    var AuthToken;
    var isAutheticate=false;

    function storeUserToken(token){
      isAutheticate=true;
      AuthToken=token;
      window.localStorage.setItem(API_ENDPOINT.LOCAL_TOKEN_KEY,token);
      $http.defaults.headers.common.Authorization = AuthToken;
    }

    function loadUserToken(){
      if(!isAutheticate || AuthToken===undefined){
        var token=window.localStorage.getItem(API_ENDPOINT.LOCAL_TOKEN_KEY);
        if(token){
          isAutheticate=true;
          AuthToken=token;
          // Set the token as header for your requests!
          $http.defaults.headers.common.Authorization = AuthToken;
          //$http.defaults.headers.common.ContentType='application/json';
        }
      }
    }
    // try to load token when service is being called first time
    loadUserToken();

    var signup=function(user){
      return $q(function(resolve,reject){
        $http.post(API_ENDPOINT.url + API_ENDPOINT.signup ,user).then(function successCallback(response){
            if(response.data.success){
              return resolve(response.data.msg);
            }
            else {
              return reject(response.data.msg);
            }
        });
      });
    };


    var login=function(user){
      return $q(function(resolve,reject){
        $http.post(API_ENDPOINT.url + API_ENDPOINT.login ,user).then(function successCallback(response){
            if(response.data.success){
              storeUserToken(response.data.token);
              return resolve(response.data.token);
            }
            else {
              return reject(response.data.msg);
            }
        });
      });
    };

    var logout=function(){
      AuthToken=undefined;
      isAutheticate=false;
      window.localStorage.removeItem(API_ENDPOINT.LOCAL_TOKEN_KEY);
      $http.defaults.headers.common.Authorization = undefined;
    };
    return{
      login : login ,
      signup : signup,
      logout : logout,
      isAutheticate : function(){ return isAutheticate;}
    };
  })
  .factory('order',function($q,$http,API_ENDPOINT){
    return {
      getAll: function(){
        return $q(function(resolve,reject){
          $http.get(API_ENDPOINT.url + API_ENDPOINT.order).then(function successCallback(response){
              if(response.data.success){
                return resolve(response.data.result);
              }
              else {
                return reject(response.data.msg);
              }
          });
        });
      },
      get: function(_id){
        return $q(function(resolve,reject){
          $http.get(API_ENDPOINT.url + API_ENDPOINT.order + '/' + _id).then(function successCallback(response){
              if(response.data.success){
                return resolve(response.data.result);
              }
              else {
                return reject(response.data.msg);
              }
          });
        });
      },
      post: function(order){
        return $q(function(resolve,reject){
          $http.post(API_ENDPOINT.url + API_ENDPOINT.order,order).then(function successCallback(response){
              if(response.data.success){
                return resolve(response.data.msg);
              }
              else {
                return reject(response.data.msg);
              }
          });
        });
      },
      put: function(order){
        return $q(function(resolve,reject){
          $http.put(API_ENDPOINT.url + API_ENDPOINT.order + '/' + order._id,order).then(function successCallback(response){
              if(response.data.success){
                return resolve(response.data.result);
              }
              else {
                return reject(response.data.msg);
              }
          });
        });
      },
      delete: function(_id){
        return $q(function(resolve,reject){
          $http.delete(API_ENDPOINT.url + API_ENDPOINT.order + '/' + _id).then(function successCallback(response){
              if(response.data.success){
                return resolve(response.data.result);
              }
              else {
                return reject(response.data.msg);
              }
          });
        });
      }
    };
  })
  .factory('AuthInterceptor', function ($rootScope, $q) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: 'auth-not-authenticated',
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})
  .run(function($location, $rootScope, $route, AuthService) {
  $rootScope.$on('$locationChangeStart', function(evt, next, current) {
    var nextPath = $location.path(),
      nextRoute = $route.routes[nextPath];
      $rootScope.active_location=nextPath;
    if (nextRoute && nextRoute.auth && !AuthService.isAutheticate()) {
      $location.path("/login");
    }
    //Ignore login / register page to acceee when user already logged in
    if (nextRoute && nextRoute.auth===false && AuthService.isAutheticate()) {
      $location.path("/dashboard");
    }
  });
});
