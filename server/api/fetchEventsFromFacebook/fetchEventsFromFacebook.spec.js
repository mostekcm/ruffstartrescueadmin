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

    it('Should find events 1 & 2 the same, 3 & 4 on facebook only and 3&4 on database', function(done) {
      facebookEvents[2]['diff'] = 'FacebookOnly';
      facebookEvents[3]['diff'] = 'FacebookOnly';
      mongoEvents[2]['diff'] = 'NotOnFacebook';
      mongoEvents[3]['diff'] = 'NotOnFacebook';
      facebookEvents[0]['diff'] = 'Synced';
      facebookEvents[1]['diff'] = 'Synced';
      var targetDiffDictionary = [
        facebookEvents[0],
        facebookEvents[1],
        facebookEvents[2],
        facebookEvents[3],
        mongoEvents[2],
        mongoEvents[3],
      ];
      controller.createDiffDictionary(facebookEvents,mongoEvents,function (diffDictionary) {
        expect(diffDictionary).deep.equal(targetDiffDictionary);
        done();
      });
    });

  });

  describe('createEventDiffs ignore old events', function() {
    var facebookEvents, mongoEvents, targetDiffs;

    beforeEach(function(done) {
      var tomorrow = moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
      var dateString = tomorrow.format("YYYY-MM-DD");
      var yesterday = moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
      var yesterdayString = yesterday.format("YYYY-MM-DD");
      var now = new Date();
      now.setHours(0,0,0,0);
      var today = moment(new Date(now));
      var todayString = today.format("YYYY-MM-DD");

      facebookEvents = [
        { name: 'both1', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'both2', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'old1', "start_time":yesterdayString+"T08:00:00-0500", "end_time":yesterdayString+"T14:00:00-0500" },
        { name: 'old3', "start_time":yesterdayString+"T08:00:00-0500" },
        { name: 'old4', "start_time":yesterdayString+"T08:00:00-0500", "end_time": null },
        { name: 'today2', "start_time":todayString+"T08:00:00-0500", "end_time": null },
        { name: 'today1', "start_time":todayString+"T00:00:00-0500", "end_time":todayString+"T00:00:00-0500" },
      ];

      mongoEvents = [
        { name: 'both1', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'both2', "start_time":dateString+"T08:00:00-0500", "end_time":dateString+"T14:00:00-0500" },
        { name: 'old2', "start_time":yesterdayString+"T08:00:00-0500", "end_time":yesterdayString+"T14:00:00-0500" },
        { name: 'today1', "start_time":todayString+"T00:00:00-0500", "end_time":todayString+"T00:00:00-0500" },
        { name: 'today2', "start_time":todayString+"T08:00:00-0500", "end_time": null },
      ];

      done();
    });

    it('Should find events 1 & 2 the same, 3 & 4 on facebook only and 3&4 on database', function(done) {
      facebookEvents[0]['diff'] = 'Synced';
      facebookEvents[1]['diff'] = 'Synced';
      facebookEvents[5]['diff'] = 'Synced';
      facebookEvents[6]['diff'] = 'Synced';
      var targetDiffDictionary = [
        facebookEvents[0],
        facebookEvents[1],
        facebookEvents[5],
        facebookEvents[6],
      ];
      controller.createDiffDictionary(facebookEvents,mongoEvents,function (diffDictionary) {
        expect(diffDictionary).deep.equal(targetDiffDictionary);
        done();
      });
    });

  });

});
