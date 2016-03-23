'use strict';

angular.module('adminApp', [
  'auth0',
  'angular-storage',
  'angular-jwt',
  'adminApp.auth',
  'adminApp.constants',
  'datatables',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function($urlRouterProvider, $locationProvider, authProvider, $httpProvider, jwtInterceptorProvider) {
    $urlRouterProvider
      .otherwise('/login');

    $locationProvider.html5Mode(true);

    authProvider.init({
      domain: 'beautyfullday.auth0.com',
      clientID: 'S2DVbEfD3ghzbEfLvvrS9ANL4mhrUrGo',
      loginState: 'login'
    });

    // We're annotating this function so that the `store` is injected correctly when this file is minified
    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
      // Return the saved token
      return store.get('token');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');

  })
  .run(function($rootScope, auth, store, jwtHelper, $state) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();

    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var token = store.get('token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(store.get('profile'), token);
          } else {
            $state.go('login');
          }
        }
      }
    });
  });
