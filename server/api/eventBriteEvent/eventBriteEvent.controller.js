/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/eventBriteEvent              ->  index
 * POST    /api/eventBriteEvent              ->  create
 * GET     /api/eventBriteEvent/:id          ->  show
 * PUT     /api/eventBriteEvent/:id          ->  update
 * DELETE  /api/eventBriteEvent/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import htmlencode from 'htmlencode';
import moment from 'moment-timezone';
import rest from '../../components/util/REST';
import config from '../../config/environment';
import EventBriteVenueCache from '../../components/eventbrite/eventbrite.venuecache';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Creates a new EventBriteEvent in the DB
export function create(req, res) {
  var facebookEvent = req.body;
  var start = moment(facebookEvent.start_time);
  var end = moment(facebookEvent.end_time);
  var cache = new EventBriteVenueCache();

  /* First we need to create the eventbrite event.  Unfortunately we have to do this in a callback because we may need to fetch venues from eventbrite */
  cache.search(facebookEvent.place, function (venue_id) {

    var eventBriteEvent = {
      event: {
        name: {
          html: htmlencode.htmlEncode(facebookEvent.name),
        },
        description: {
          html: facebookEvent.description + "<br/><br/>For more information and to see who will be there please see our <a href='https://www.facebook.com/events/" + facebookEvent.id + "/'>facebook event</a>."
        },
        start: {
          "timezone": "America/Chicago",
          "utc": start.utc().format().slice(0, 19) + "Z",
        },
        end: {
          "timezone": "America/Chicago",
          "utc": end.utc().format().slice(0, 19) + "Z",
        },
        currency: "USD",
        venue_id: venue_id,
        organizer_id: "1876575717",
        category_id: "111",
        subcategory_id: "11001",
        "listed": true,
        "logo_id": "19366836",
        "capacity": 100,
      }
    };

    /* Create an eventbrite event from the passed in event */
    rest.post(
      'www.eventbriteapi.com',
      '/v3/events/',
      config.secrets.eventbrite.key,
      eventBriteEvent,
      function (event) {
        /* Patch eventbrite events so the fields are the same names */
        if ("status_code" in event) {
          console.error("Error creating eventbrite event for event (%s), eventbriteEvent (%s), error(%s)",JSON.stringify(facebookEvent),JSON.stringify(eventBriteEvent),JSON.stringify(event));
          handleError(res, event.status_code)(event);
        } else {

          var ticket_class = {
            "ticket_class": {
              "name": "General",
              "free": true,
              "minimum_quantity": 1,
              "maximum_quantity": 10,
              "quantity_total": 100
            }
          };
          /* Create some tickets first, then try to publish */
          rest.post(
            'www.eventbriteapi.com',
            '/v3/events/' + event.id + '/ticket_classes/',
            config.secrets.eventbrite.key,
            ticket_class,
            function (ticket_class) {
              /* Patch eventbrite events so the fields are the same names */
              if ("status_code" in ticket_class) {
                console.error("Error adding tickets to event event (%s), eventbriteEvent (%s), error(%s)",JSON.stringify(facebookEvent),JSON.stringify(eventBriteEvent),JSON.stringify(ticket_class));
                handleError(res, ticket_class.status_code)(ticket_class);
              } else {
                /* I think we need to call the "make live" endpoint */
                rest.post(
                  'www.eventbriteapi.com',
                  '/v3/events/' + event.id + '/publish/',
                  config.secrets.eventbrite.key,
                  {},
                  function (data) {
                    /* Patch eventbrite events so the fields are the same names */
                    if ("status_code" in data) {
                      console.error("Error publishing event (%s), eventbriteEvent (%s), error(%s)",JSON.stringify(facebookEvent),JSON.stringify(eventBriteEvent),JSON.stringify(data));
                      handleError(res, data.status_code)(data);
                    } else {
                      respondWithResult(res, 201)(eventBriteEvent);
                    }
                  }
                );
              }
            }
          );
        }
      });
  }, function (error) {
    console.error("Error with getting the venue ID for event (%s), error(%s)",JSON.stringify(facebookEvent),JSON.stringify(error));
    handleError(res, 400)(error);
  });
}

// Deletes a EventBriteEvent from the DB
export function destroy(req, res) {
  //EventBriteEvent.findByIdAsync(req.params.id)
  //  .then(handleEntityNotFound(res))
  //  .then(removeEntity(res))
  //  .catch(handleError(res));
}
