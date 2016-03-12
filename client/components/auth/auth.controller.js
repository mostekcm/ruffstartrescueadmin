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
    this.auth.signin({gravatar:false}, function (profile, token) {
      // Success callback
      store.set('profile', profile);
      store.set('token', token);
      $state.go('main');
    }, function (error) {
      // Error callback
      alert('error!: '+error);
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
