'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var AuthCtrl, auth, store;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller,$http,$state) {
    AuthCtrl = $controller('AuthCtrl', {
      $http: $http,
      $state: $state,
      auth: auth,
      store: store
    });
  }));

  //it('Admin should return true for admin', function () {
  //  store = { profile: { roles: ['admin']}};
  //  expect(AuthCtrl.isAdmin()).to.equal(true);
  //});
  //
  //it('Non-admin should return false', function () {
  //  store = { profile: { roles: ['admin']}};
  //  expect(AuthCtrl.isAdmin()).to.equal(false);
  //});
  //
  //it('Not logged in should return false', function () {
  //  store = { profile: { roles: ['admin']}};
  //  expect(AuthCtrl.isAdmin()).to.equal(false);
  //});

});
