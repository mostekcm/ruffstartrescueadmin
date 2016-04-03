/**
 * Created by mostekcm on 02/04/16.
 */
import config from '../../config/environment';
import rest from '../util/REST';
import moment from 'moment-timezone';
import mcache from 'memory-cache';
import EventBriteServiceImpl from './eventbrite.service';

function EventBriteVenueCache(EventBriteService) {
  if (EventBriteService) this.EventBriteService = EventBriteService;
  else this.EventBriteService = new EventBriteServiceImpl();
}

/**
 * Grab the map from the cache or reload it from the eventbrite service
 * @param callback on success call this method function (venueCache) { ... }
 * @param errorCallback on failure call this function (error) { ... }
 */
EventBriteVenueCache.prototype.getMap = function getMap(callback, errorCallback) {
  var key = "EventBriteVenueCache__map";
  var cache = mcache.get(key);
  if (!cache) {
    console.log("START retrieving venues from eventbrite...");
    /* We don't have it yet, let's grab it from eventbrite */
    this.EventBriteService.getVenues(function (venues) {
      cache = {};
      venues.forEach(function (venue) {
        /* All we really care about is the ID */
        if (venue.address && venue.address.address_1) {
          /* ignore any venue without an address */
          cache[venue.address.address_1] = venue.id;
        }
      });

      /* Save the venues in the cache for an hour */
      mcache.put(cache, 1000 * 60 * 60);

      console.log("DONE  retrieving venues from eventbrite...");
      callback(cache);
    }, function (error) {
      console.error("Couldn't get venues for some reason, returning null: " + JSON.stringify(error));
      errorCallback(error);
    });
  } else {
    callback(cache);
  }
}

/**
 * Search through the cache to see if there is actually an
 * @param address The address should be in the format { street: ..., name: ..., ....}
 * @callback function (venue_id) { ... }
 * @errorCallback function (error) { ... }
 */
EventBriteVenueCache.prototype.search = function search(address, callback, errorCallback) {

  if (!address.location || !address.location.street) {
    errorCallback({message: "Bad address from facebook"});
  } else {
    var instance = this;
    this.getMap(function (venueMap) {
      var venue_id = null;

      /* find the value in the cache if it exists */
      if (address.location.street in venueMap) {
        callback(venueMap[address.location.street]);
      } else {
        /* if it does not exist, create it */
        instance.EventBriteService.createVenue(address, function (venue) {
          venue_id = venue.id;
          venueMap[address.location.street] = venue_id;
          callback(venue_id);
        }, function (error) {
          console.error("Could not create new venue for address (%s) because (%s)", JSON.stringify(address), JSON.stringify(error));
          errorCallback(error);
        });
      }
    }, errorCallback);
  }
}

module.exports = EventBriteVenueCache;
