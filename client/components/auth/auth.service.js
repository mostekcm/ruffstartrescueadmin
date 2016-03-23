'use strict';

(function() {

/**
 * The Util service is for thin, globally reusable, utility functions
 */
function AuthUtilService($window, auth) {
  var AuthUtil = {

    /**
     * @return true if this is an admin user
     */
    isAdmin: function() {
      return auth.isAuthenticated && auth.profile.app_metadata.roles.indexOf('admin') >= 0;
    }
  };

  return AuthUtil;
}

angular.module('adminApp.auth')
  .factory('AuthUtil', AuthUtilService);

})();
