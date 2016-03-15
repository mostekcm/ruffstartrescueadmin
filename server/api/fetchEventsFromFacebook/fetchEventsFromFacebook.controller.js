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

/**
 * ONLY EXPORTING THIS FOR TESTING PURPOSES, though it could be used elsewhere.
 * @param facebookEvents the list of facebook events
 * @param mongoEvents the list of mongo events
 * @param callback  function callback(eventDictionary) {...} a callback that will be passed a list of events split out into three categories eventDictionary => { onFacebookOnly: [...], notOnFacebook: [...], good: [...] }
 */
export function createDiffDictionary(facebookEvents, mongoEvents, callback) {
  var diffs = { onFacebookOnly: [], notOnFacebook: [], good: []};
  /* Create a dictionary of mongoEvents */
  var mongoEventMap = {};
  mongoEvents.forEach(function(mongoEvent) {
    mongoEventMap[mongoEvent.name] = mongoEvent;
  });

  /* Create a dictionary of facebookEvents that aren't in Mongo yet */
  var facebookEventMap = {};
  facebookEvents.forEach(function(facebookEvent) {
    if (facebookEvent.name in mongoEventMap)
    {
      diffs.good.push(mongoEventMap[facebookEvent.name]);
      /* Delete from mongoEventMap */
      delete mongoEventMap[facebookEvent.name];
    } else
    {
      /* Add it to the onFacebookOnly */
      diffs.onFacebookOnly.push(facebookEvent);
    }
  });

  /* Now put the leftover DB events into the notOnFacebook for deletion approval */
  for (var name in mongoEventMap) {
    diffs.notOnFacebook.push(mongoEventMap[name]);
  }

  callback(diffs);
}

function calculateDiffs(req, res, callback) {
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      "client_id":     config.secrets.facebook.clientID,
      "redirect_uri":  config.secrets.facebook.redirectUri,
      "scope":         'public_profile'
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  var diffs = {};

  // code is set
  // we'll send that and get the access token
  graph.authorize({
    "client_id":      config.secrets.facebook.clientID,
    "redirect_uri":   config.secrets.facebook.redirectUri,
    "client_secret":  config.secrets.facebook.secret,
    "code":           req.query.code
  }, function (err, facebookRes) {
    /* Okay we are authorized, set the access token */
    graph.setAccessToken(facebookRes.access_token);

    /* okay, now we have set it, grab the list of events from facebook */
    graph.get("ruffstart/events", function(err, facebookRes) {
      var facebookEvents = facebookRes.data;
      /* We now have our facebook events.  Match them to the events in Mongo */
       Event.findAsync()
        .then(function(mongoEvents) {
          createDiffDictionary(facebookEvents,mongoEvents,callback);
        })
        .catch(handleError(res));
    });
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
