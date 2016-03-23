'use strict';

angular.module('adminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('events', {
        url: '/events',
        templateUrl: 'app/events/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'events',
        data: {
          requiresLogin: true
        }
      });
  });
