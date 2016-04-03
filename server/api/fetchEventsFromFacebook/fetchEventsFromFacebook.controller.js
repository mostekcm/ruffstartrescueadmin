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
import rest from '../../components/util/REST';
import moment from 'moment-timezone';

function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

/**
 * Remove any events that have a date older than todays date.  Ignore time.
 * @param allEvents -- events must have the format [ { start_time: "YYYY-MM-DDTHH:MM:SS-ZZZZ" .... }, {...}, ... ]
 * @returns {Array}
 */
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
    } else {
      //console.log('SKIPPED: '+event.name+', '+date+', current: '+current+', end');
    }
  });

  return events;
}

/**
 * Facebook and moment disagree on how to format the timezone offset
 * @param timeString
 * @returns {*}
 */
function killTimezoneColon(timeString) {
  return timeString.slice(0,22) + timeString.slice(23,timeString.length);
}

/**
 * Event brite does funny things with their event format, converting them appropriately here.
 * @param rawEventbriteEvents
 * @returns {Array}
 */
function patchEventbriteEvents(rawEventbriteEvents) {
  var eventbriteEvents = [];
  rawEventbriteEvents.forEach(function(eventbriteEvent) {
    eventbriteEvent.description = eventbriteEvent.description.html;
    eventbriteEvent.name = eventbriteEvent.name.text;
    var start = moment.tz(eventbriteEvent.start.local, eventbriteEvent.start.timezone);
    var end = moment.tz(eventbriteEvent.end.local, eventbriteEvent.end.timezone);
    eventbriteEvent.start_time = killTimezoneColon(start.format());
    eventbriteEvent.end_time = killTimezoneColon(end.format());
    eventbriteEvents.push(eventbriteEvent);
  });
  return eventbriteEvents;
}

/**
 * ONLY EXPORTING THIS FOR TESTING PURPOSES, though it could be used elsewhere.
 * @param facebookEvents the list of facebook events
 * @param eventbriteEvents the list of eventbrite events
 * @param callback  function callback(eventDictionary) {...} a callback that will be passed a list of events split out into three categories eventDictionary => { onFacebookOnly: [...], notOnFacebook: [...], good: [...] }
 */
export function createDiffDictionary(facebookEvents, eventbriteEvents, callback) {
  /* Only Care about current events */
  facebookEvents = filterOutOldEvents(facebookEvents);
  eventbriteEvents = filterOutOldEvents(eventbriteEvents);

  var diffs = [];
  /* Create a dictionary of mongoEvents */
  var eventbriteEventMap = {};
  eventbriteEvents.forEach(function(eventbriteEvent) {
    //console.log("Carlos, found eventbrite: "+eventbriteEvent.name);
    if (!(eventbriteEvent.name in eventbriteEventMap)) {
      eventbriteEventMap[eventbriteEvent.name] = {};
    }
    eventbriteEventMap[eventbriteEvent.name][eventbriteEvent.start_time] = eventbriteEvent;
  });

  /* Create a dictionary of facebookEvents that aren't in eventbrite yet */
  facebookEvents.forEach(function(facebookEvent) {
    if (facebookEvent.name in eventbriteEventMap &&
        facebookEvent.start_time in eventbriteEventMap[facebookEvent.name])
    {
      facebookEvent.diff = 'Synced';
      diffs.push(facebookEvent);
      /* Delete from eventbriteEventMap */
      delete eventbriteEventMap[facebookEvent.name][facebookEvent.start_time];
    } else
    {
      /* Add it to the onFacebookOnly */
      facebookEvent['diff'] = 'FacebookOnly';
      diffs.push(facebookEvent);
    }
  });

  /* Now put the leftover DB events into the notOnFacebook for deletion approval */
  for (var name in eventbriteEventMap) {
    for (var start_time in eventbriteEventMap[name]) {
      eventbriteEventMap[name][start_time]['diff'] = 'NotOnFacebook';
      diffs.push(eventbriteEventMap[name][start_time]);
    }
  }

  callback(diffs);
}

function calculateDiffs(req, res, callback) {

  var diffs = {};

  graph.setAccessToken(config.secrets.facebook.clientID + '|' + config.secrets.facebook.secret);

  /* okay, now we have set it, grab the list of events from facebook */
  graph.get("ruffstart/events", function(err, facebookRes) {
    if (err) {
      handleError(res);
    } else {
      var facebookEvents = facebookRes.data;
      /* We now have our facebook events.  Match them to the events in eventbrite */
      rest.get(
        'www.eventbriteapi.com',
        '/v3/users/me/owned_events/',
        config.secrets.eventbrite.key,
        {status:'live',order_by:'start_asc'},
        function(data) {
          /* Patch eventbrite events so the fields are the same names */
          createDiffDictionary(facebookEvents, patchEventbriteEvents(data.events), callback);
      });
    }
    /* Used to check against mongo, but should instead check against eventbrite
    Event.findAsync()
      .then(function (mongoEvents) {
        createDiffDictionary(facebookEvents, mongoEvents, callback);
      })
      .catch(handleError(res));
      */
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
