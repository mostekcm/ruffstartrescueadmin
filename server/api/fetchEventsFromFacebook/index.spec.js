'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var fetchEventsFromFacebookCtrlStub = {
  index: 'fetchEventsFromFacebookCtrl.index',
  sync: 'fetchEventsFromFacebookCtrl.sync',
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy(),
};

// require the index with our stubbed out modules
var fetchEventsFromFacebookIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './fetchEventsFromFacebook.controller': fetchEventsFromFacebookCtrlStub
});

describe('FetchEventsFromFacebook API Router:', function() {

  it('should return an express router instance', function() {
    expect(fetchEventsFromFacebookIndex).to.equal(routerStub);
  });

  describe('GET /api/fetchEventsFromFacebook', function() {

    it('should route to fetchEventsFromFacebook.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'fetchEventsFromFacebookCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/fetchEventsFromFacebook', function() {

    it('should route to fetchEventsFromFacebook.controller.sync', function() {
      expect(routerStub.post
        .withArgs('/', 'fetchEventsFromFacebookCtrl.sync')
        ).to.have.been.calledOnce;
    });

  });

});
