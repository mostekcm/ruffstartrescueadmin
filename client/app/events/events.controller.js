'use strict';

class EventsController {
  constructor($resource, $http, auth, AuthUtil, DTOptionsBuilder, DTColumnDefBuilder) {
    /* Create the base dtOptions instance */
    var vm = this;
    this.$http = $http;
    this.auth = auth;
    this.errorMessage = "";
    vm.AuthUtil = AuthUtil;
    //vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
    //    return $resource('/api/fetchEventsFromFacebook', {},
    //      {
    //        query: {
    //          isArray: true,
    //          method: 'GET',
    //        }
    //      }).query().$promise;
    //  })//.withDOM('Bfrtip')
    vm.dtOptions = DTOptionsBuilder.newOptions()//.withDOM('Bfrtip')
      .withPaginationType('full_numbers')
      // Active Responsive plugin
      .withOption('responsive', true);

    /* Create the columns based on the requested list of columns */
    vm.dtColumnDefs = [
      //DTColumnBuilder.newColumn('diff').withTitle('Status').withOption('defaultContent', ''),
      //DTColumnBuilder.newColumn('name').withTitle('Name').withOption('defaultContent', ''),
      //DTColumnBuilder.newColumn('start_time').withTitle('Start Time').withOption('defaultContent', ''),
      //DTColumnBuilder.newColumn('end_time').withTitle('End Time').withOption('defaultContent', ''),
      //DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(vm.actionsHtml)
      DTColumnDefBuilder.newColumnDef(0).withOption('defaultContent', ''),
      DTColumnDefBuilder.newColumnDef(1).withOption('defaultContent', ''),
      DTColumnDefBuilder.newColumnDef(2).withOption('defaultContent', ''),
      DTColumnDefBuilder.newColumnDef(3).withOption('defaultContent', ''),
      DTColumnDefBuilder.newColumnDef(4)
    ];

    $resource('/api/fetchEventsFromFacebook', {},
      {
        query: {
          isArray: true,
          method: 'GET',
        }
      }).query().$promise.then(function (events) {
      vm.events = events;
    });
  }

  synchronize() {
    // NOT IMPLEMENTED YET
  };

  isPermitted() {
    return this.AuthUtil.isAdmin();
  };

  notPermitted() {
    return !this.isPermitted();
  };

  createEventbrite(event) {
    /* Send request */
    this.errorMessage = "";
    var ctrl = this;
    this.$http.post('/api/eventBriteEvent', event)
      .then(function() {
        /* On Success, convert this row to a diff == Synced */
        event.diff = 'Synced';
      }, function(error) {
        /* On Failure, growl */
        console.log(error);
        if (error.data && error.data.message) {
          ctrl.errorMessage = error.data.message;
        } else {
          ctrl.errorMessage = JSON.stringify(error);
        }
      });
  };

  delete(event) {
    /* Send request */

    /* On Success, convert this row to a diff == OnFacebookOnly */
    event.diff = 'FacebookOnly';

    /* On Failure, growl */
  };

}

angular.module('adminApp')
  .controller('EventsCtrl', EventsController);
