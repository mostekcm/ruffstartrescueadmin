/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/fetchEventsFromFacebook              ->  index
 * POST    /api/fetchEventsFromFacebook              ->  sync
 */

'use strict';

import _ from 'lodash';
import graph from 'fbgraph';
import config from '../../config/environment';
import Event from '../event/event.model';

function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

function filterOutOldEvents(allEvents) {
  var events = [];
  /* First filter out old events */
  allEvents.forEach(function(event) {
    /* Use end time if available */
    var end = new Date(event.end_time);
    var start = new Date(event.start_time);
    var date = null;
    if (!isValidDate(end) || end < start) {
      date = start;
    } else {
      date = end;
    }
    var current = new Date(Date.now());

    /* Just check the date part */
    date.setHours(0,0,0,0);
    current.setHours(0,0,0,0);
    if (date >= current) {
      events.push(event);
    }
  });

  return events;
}

/**
 * ONLY EXPORTING THIS FOR TESTING PURPOSES, though it could be used elsewhere.
 * @param facebookEvents the list of facebook events
 * @param mongoEvents the list of mongo events
 * @param callback  function callback(eventDictionary) {...} a callback that will be passed a list of events split out into three categories eventDictionary => { onFacebookOnly: [...], notOnFacebook: [...], good: [...] }
 */
export function createDiffDictionary(facebookEvents, mongoEvents, callback) {
  /* Only Care about current events */
  facebookEvents = filterOutOldEvents(facebookEvents);
  mongoEvents = filterOutOldEvents(mongoEvents);

  var diffs = [];
  /* Create a dictionary of mongoEvents */
  var mongoEventMap = {};
  mongoEvents.forEach(function(mongoEvent) {
    mongoEventMap[mongoEvent.name] = mongoEvent;
  });

  /* Create a dictionary of facebookEvents that aren't in Mongo yet */
  facebookEvents.forEach(function(facebookEvent) {
    if (facebookEvent.name in mongoEventMap)
    {
      mongoEventMap[facebookEvent.name]['diff'] = 'Synced';
      diffs.push(mongoEventMap[facebookEvent.name]);
      /* Delete from mongoEventMap */
      delete mongoEventMap[facebookEvent.name];
    } else
    {
      /* Add it to the onFacebookOnly */
      facebookEvent['diff'] = 'FacebookOnly';
      diffs.push(facebookEvent);
    }
  });

  /* Now put the leftover DB events into the notOnFacebook for deletion approval */
  for (var name in mongoEventMap) {
    mongoEventMap[name]['diff'] = 'NotOnFacebook';
    diffs.push(mongoEventMap[name]);
  }

  callback(diffs);
}

function calculateDiffs(req, res, callback) {

  var diffs = {};

  graph.setAccessToken(config.secrets.facebook.clientID + '|' + config.secrets.facebook.secret);

  /* okay, now we have set it, grab the list of events from facebook */
  graph.get("ruffstart/events", function(err, facebookRes) {
    var facebookEvents = facebookRes.data;


    /* We now have our facebook events.  Match them to the events in Mongo */
    Event.findAsync()
      .then(function (mongoEvents) {
        createDiffDictionary(facebookEvents, mongoEvents, callback);
      })
      .catch(handleError(res));
  });
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Find all events on facebook and compare with local database, get just responds with differences, post applies the differences
export function index(req, res) {
  calculateDiffs(req, res, respondWithResult(res));
  // FetchEventsFromFacebook.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
}

// Applies all changes in events to FetchEventsFromFacebook in the DB
export function sync(req, res) {
  //FetchEventsFromFacebook.createAsync(req.body)
  //  .then(respondWithResult(res, 201))
  //  .catch(handleError(res));
}
