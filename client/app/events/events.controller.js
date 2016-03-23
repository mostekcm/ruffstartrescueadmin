'use strict';

class EventsController {
  constructor($resource, auth, AuthUtil, DTOptionsBuilder, DTColumnBuilder) {
    /* Create the base dtOptions instance */
    var vm = this;
    this.auth = auth;
    vm.AuthUtil = AuthUtil;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        return $resource('/api/fetchEventsFromFacebook', {},
          {
            query: {
              isArray: true,
              method: 'GET',
            }
          }).query().$promise;
      })//.withDOM('Bfrtip')
      .withPaginationType('full_numbers');

    /* Create the columns based on the requested list of columns */
    vm.dtColumns = [
      DTColumnBuilder.newColumn('diff').withTitle('Type').withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('name').withTitle('Name').withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('start_time').withTitle('Start Time').withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('end_time').withTitle('End Time').withOption('defaultContent', '')
    ];
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
}

angular.module('adminApp')
  .controller('EventsCtrl', EventsController);
