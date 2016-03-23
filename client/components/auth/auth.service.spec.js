'use strict';

describe('Authorization utilities', function () {

  // load the controller's module
  beforeEach(module('adminApp.auth'));

  var authUtilService;

  describe('true for admin', function () {
    // Initialize the controller and a mock scope
    beforeEach(module(function ($provide) {
      $provide.value('auth', {isAuthenticated: true, hookEvents: function() {}, profile: { app_metadata: { roles: ['admin']}}});
    }));

    beforeEach(inject(function (AuthUtil) {
      authUtilService = AuthUtil;
    }));

    it('Admin should return true for admin', function () {
      expect(authUtilService.isAdmin()).to.equal(true);
    });
  });

  describe('false for non-admin', function () {
    // Initialize the controller and a mock scope
    beforeEach(module(function ($provide) {
      $provide.value('auth', {isAuthenticated: true, hookEvents: function() {}, profile: { app_metadata: { roles: ['user']}}});
    }));

    beforeEach(inject(function (AuthUtil) {
      authUtilService = AuthUtil;
    }));

    it('Non-admin should return false', function () {
      expect(authUtilService.isAdmin()).to.equal(false);
    });
  });

  describe('false for not logged in', function () {
    // Initialize the controller and a mock scope
    beforeEach(module(function ($provide) {
      $provide.value('auth', {isAuthenticated: false, hookEvents: function() {}, profile: { app_metadata: { roles: ['admin']}}});
    }));

    beforeEach(inject(function (AuthUtil) {
      authUtilService = AuthUtil;
    }));

    it('Not logged in should return false', function () {
      expect(authUtilService.isAdmin()).to.equal(false);
    });
  });

});
