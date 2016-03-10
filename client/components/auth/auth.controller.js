'use strict';

class AuthController {

  constructor($http, auth, store, $state) {
    this.$http = $http;
    this.auth = auth;
    this.store = store;
    this.$state = $state;
  }

  login() {
    var store = this.store;
    var $state = this.$state;
    this.auth.signin({}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $state.go('main');
    }, function () {
      // Error callback
      alert('error!');
    });
  }

  logout() {
    this.auth.signout();
    this.store.remove('profile');
    this.store.remove('token');
    this.$state.go(this.$state.current.name, this.$state.params, { reload: true });
  }

}

angular.module('adminApp.auth', ['auth0','angular-storage','angular-jwt'])
  .controller('AuthCtrl', AuthController);
