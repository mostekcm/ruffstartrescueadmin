'use strict';

var app = require('../..');
import request from 'supertest';

var newFetchEventsFromFacebook;

describe('FetchEventsFromFacebook API:', function() {

  describe('GET /api/fetchEventsFromFacebook', function() {
    var fetchEventsFromFacebooks;

    beforeEach(function(done) {
      request(app)
        .get('/api/fetchEventsFromFacebook')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          fetchEventsFromFacebooks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(fetchEventsFromFacebooks).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/fetchEventsFromFacebook', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/fetchEventsFromFacebook')
        .send({
          name: 'New FetchEventsFromFacebook',
          info: 'This is the brand new fetchEventsFromFacebook!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFetchEventsFromFacebook = res.body;
          done();
        });
    });

    it('should respond with the newly created fetchEventsFromFacebook', function() {
      expect(newFetchEventsFromFacebook.name).to.equal('New FetchEventsFromFacebook');
      expect(newFetchEventsFromFacebook.info).to.equal('This is the brand new fetchEventsFromFacebook!!!');
    });

  });

});
