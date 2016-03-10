'use strict';

angular.module('adminApp.auth')
  .directive('authLogin', function() {
    return {
      templateUrl: 'components/auth/auth-login.html',
      restrict: 'EA',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      scope: {
        classes: '@'
      }
    }})
    .directive('authLogout', function() {
      return {
        templateUrl: 'components/auth/auth-logout.html',
        restrict: 'EA',
        controller: 'AuthCtrl',
        controllerAs: 'auth',
        scope: {
          classes: '@'
        }
      };
  });
