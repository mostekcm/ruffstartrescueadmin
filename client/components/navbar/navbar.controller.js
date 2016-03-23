'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Events',
    'state': 'events'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(auth) {
    this.auth = auth;
  }
}

angular.module('adminApp')
  .controller('NavbarController', NavbarController);
