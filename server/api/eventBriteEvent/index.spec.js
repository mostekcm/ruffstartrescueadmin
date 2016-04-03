'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var eventBriteEventCtrlStub = {
  create: 'eventBriteEventCtrl.create',
  destroy: 'eventBriteEventCtrl.destroy'
};

var routerStub = {
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var eventBriteEventIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './eventBriteEvent.controller': eventBriteEventCtrlStub
});

describe('EventBriteEvent API Router:', function() {

  it('should return an express router instance', function() {
    expect(eventBriteEventIndex).to.equal(routerStub);
  });

  describe('POST /api/eventBriteEvent', function() {

    it('should route to eventBriteEvent.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'eventBriteEventCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/eventBriteEvent', function() {

    it('should route to eventBriteEvent.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/', 'eventBriteEventCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
