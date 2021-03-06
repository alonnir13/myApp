// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
  .config(function($ionicConfigProvider){
    $ionicConfigProvider.tabs.position('top');
  })

.config(function (localStorageServiceProvider, $httpProvider) {
  //$httpProvider.defaults.withCredentials = true;
  //$httpProvider.interceptors.push(function() {
  //  return {
  //    request: function(req) {
  //      // Set the `Authorization` header for every outgoing HTTP request
  //      req.headers.Authorization =
  //        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtb3NoZTEyMyIsImNyZWF0ZWQiOjE0NjgxNzYyNjUxNjksImV4cCI6MTQ2ODc4MTA2NX0.eNLGtgrsqbp8-a-vUT8-5pJfusfJ7_sR29e3-YdZqH1NIJb6kpFK42mE2NHiXkK3YEaJgE2JUDSxeJhe-5nkTQ';
  //      return req;
  //    }
  //  };
  //});
  localStorageServiceProvider
    .setPrefix('data-provider');
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  //$stateProvider
  //
  //// setup an abstract state for the tabs directive
  //  .state('tab', {
  //  url: '/tab',
  //  abstract: true,
  //  templateUrl: 'templates/tabs.html'
  //})
  //



  $stateProvider
  // Each tab has its own nav history stack:
    .state('asset', {
      url: '/asset/:assetid',
      templateUrl: 'templates/asset.html',
      controller: 'assetCtrl'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardController'
    })
    .state('chat-detail', {
      url: '/chats/:chatId',
      templateUrl: 'templates/chat-detail.html',
      controller: 'ChatDetailCtrl'
    })
    .state('search', {
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
    })
    .state('search-result', {
      url: '/search-result',
      templateUrl: 'templates/search-result.html',
      controller: 'SearchCtrl'
    })
    .state('upload', {
      url:'/upload',
      templateUrl: 'templates/upload.html',
      controller: 'UploadCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})
  .run(function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

      if (!AuthService.isAuthenticated()) {
        if (next.name !== 'login') {
          event.preventDefault();
          $state.go('login');
        }
      }
    });
  });
