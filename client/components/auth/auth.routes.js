'use strict';

angular.module('adminApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'components/auth/auth-login.html',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      });
  });
