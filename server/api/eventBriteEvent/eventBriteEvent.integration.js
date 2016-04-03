'use strict';

var app = require('../..');
import request from 'supertest';

var newEventBriteEvent;

describe('EventBriteEvent API:', function() {

  describe('GET /api/eventBriteEvent', function() {
    var eventBriteEvents;

    beforeEach(function(done) {
      request(app)
        .get('/api/eventBriteEvent')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          eventBriteEvents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(eventBriteEvents).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/eventBriteEvent', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/eventBriteEvent')
        .send({
          name: 'New EventBriteEvent',
          info: 'This is the brand new eventBriteEvent!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEventBriteEvent = res.body;
          done();
        });
    });

    it('should respond with the newly created eventBriteEvent', function() {
      expect(newEventBriteEvent.name).to.equal('New EventBriteEvent');
      expect(newEventBriteEvent.info).to.equal('This is the brand new eventBriteEvent!!!');
    });

  });

  describe('GET /api/eventBriteEvent/:id', function() {
    var eventBriteEvent;

    beforeEach(function(done) {
      request(app)
        .get('/api/eventBriteEvent/' + newEventBriteEvent._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          eventBriteEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      eventBriteEvent = {};
    });

    it('should respond with the requested eventBriteEvent', function() {
      expect(eventBriteEvent.name).to.equal('New EventBriteEvent');
      expect(eventBriteEvent.info).to.equal('This is the brand new eventBriteEvent!!!');
    });

  });

  describe('PUT /api/eventBriteEvent/:id', function() {
    var updatedEventBriteEvent;

    beforeEach(function(done) {
      request(app)
        .put('/api/eventBriteEvent/' + newEventBriteEvent._id)
        .send({
          name: 'Updated EventBriteEvent',
          info: 'This is the updated eventBriteEvent!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedEventBriteEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEventBriteEvent = {};
    });

    it('should respond with the updated eventBriteEvent', function() {
      expect(updatedEventBriteEvent.name).to.equal('Updated EventBriteEvent');
      expect(updatedEventBriteEvent.info).to.equal('This is the updated eventBriteEvent!!!');
    });

  });

  describe('DELETE /api/eventBriteEvent/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/eventBriteEvent/' + newEventBriteEvent._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when eventBriteEvent does not exist', function(done) {
      request(app)
        .delete('/api/eventBriteEvent/' + newEventBriteEvent._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
