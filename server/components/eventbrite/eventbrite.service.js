'use strict';

/**
 * Created by mostekcm on 02/04/16.
 */
import config from '../../config/environment';
import restImpl from '../util/REST';
import moment from 'moment-timezone';

function EventBriteService(restInject) {
  if (!restInject) {
    this.rest = restImpl;
  } else {
    this.rest = restInject;
  }
  this.venues = [];
}

/**
 * Load a single page
 * @param page the page number to load
 * @param doneCallback
 * @param errorCallback
 */
EventBriteService.prototype.loadVenuePage = function loadVenuePage(page, doneCallback, errorCallback) {
  var instance = this;
  // Call the end point to get the next page
  this.rest.get(
    'www.eventbriteapi.com',
    '/v3/users/me/venues/',
    config.secrets.eventbrite.key,
    {"page": page},
    function (data) {
      /* Check that we didn't get an error */
      if (!("venues" in data)) {
        /* Have an error */
        errorCallback(data);
      } else {
        /* Got results, process them! */
        //console.log("Carlos venues: %d", data.venues.length);
        instance.venues = instance.venues.concat(data.venues);
        //console.log("Carlos venues2: %d", instance.venues.length);

        /* Now check and see if we are at the end of our pages */
        if (page < data.pagination.page_count) {
          /* Recursively call this function */
          instance.loadVenuePage(page + 1, doneCallback, errorCallback);
        } else {
          doneCallback(instance.venues);
        }
      }
    });
}
/**
 * Get the venues from eventbrite
 * @param callback function (venues) { ... }
 * @param errorCallback function (errorJson) { ... }
 */
EventBriteService.prototype.getVenues = function getVenues(callback, errorCallback)
{
  /* Load the first page */
  this.loadVenuePage(1, callback, errorCallback);
}

/**
 * Create a new venue
 * @param venue The venue in facebook like format { "street": "12084 Homestead Dr.", "city": "Minneapolis", ... }
 * @param callback
 * @param errorCallback
 */
EventBriteService.prototype.createVenue = function createVenue(venue, callback, errorCallback)
{
  /* First convert from facebook like to evenbrite like */
  var eventBriteVenue = {
    "venue" : {
      "name": venue.name,
      "address": {
        "address_1": venue.location.street,
        "city": venue.location.city,
        "region": venue.location.state,
        "postal_code": venue.location.zip,
        "latitude": venue.location.latitude,
        "longitude": venue.location.longitude
      }
    }
  };

  // Call the end point to get the next page
  this.rest.post(
    'www.eventbriteapi.com',
    '/v3/venues/',
    config.secrets.eventbrite.key,
    eventBriteVenue,
    function (venue) {
      if ("address" in venue) {
        /* Success! */
        callback(venue);
      } else {
        errorCallback(venue);
      }
    }
  );
}

module.exports = EventBriteService;

