'use strict';

var app = require('../..');
import request from 'supertest';
import moment from 'moment';
var controller = require('./fetchEventsFromFacebook.controller');

describe('FetchEventsFromFacebook Underlying Methods:', function() {

  describe('createEventDiffs some of each', function() {
    var facebookEvents, mongoEvents, targetDiffs;

    beforeEach(function(done) {
      var tomorrow = moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
      var dateString = tomorrow.format("YYYY-MM-DD");

      facebookEvents = [
        { name: 'both1', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'both2', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'facebook1', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'facebook2', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" }
      ];

      mongoEvents = [
        { name: 'both1', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'both2', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'notOnFacebook1', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'notOnFacebook2', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" }
      ];

      done();
    });

    it('should respond with JSON array', function(done) {
      var targetDiffDictionary = {
        onFacebookOnly: [
          facebookEvents[2],
          facebookEvents[3]
        ],
        notOnFacebook: [
          mongoEvents[2],
          mongoEvents[3]
        ],
        good: [
          facebookEvents[0],
          facebookEvents[1]
        ]
      };
      controller.createDiffDictionary(facebookEvents,mongoEvents,function (diffDictionary) {
        expect(diffDictionary.onFacebookOnly).deep.equal(targetDiffDictionary.onFacebookOnly);
        expect(diffDictionary.notOnFacebook).deep.equal(targetDiffDictionary.notOnFacebook);
        expect(diffDictionary.good).deep.equal(targetDiffDictionary.good);
        done();
      });
    });

  });
});
