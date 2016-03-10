'use strict';

class NavbarController {
  //start-non-standard
  menu = [/*{
    'title': 'Home',
    'state': 'main'
  }*/];

  isCollapsed = true;
  //end-non-standard

  constructor(auth) {
    this.auth = auth;
  }
}

angular.module('adminApp')
  .controller('NavbarController', NavbarController);
