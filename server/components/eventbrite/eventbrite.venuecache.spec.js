'use strict';

var app = require('../..');
var VenueCache = require('./eventbrite.venuecache');

describe('Eventbrite Venue Cache Unit Tests', function () {

  describe('test good day', function () {
    var venueCache;
    var venues = [
      {
        "address": {
          "address_1": "1425 7th St E",
          "address_2": null,
          "city": "Monticello",
          "region": "MN",
          "postal_code": "55362",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4072043/",
        "id": "4072043",
        "name": null,
        "latitude": "45.2948905",
        "longitude": "-93.7785796"
      },
      {
        "address": {
          "address_1": "11200 Fountains Drive",
          "address_2": null,
          "city": "Maple Grove",
          "region": "MN",
          "postal_code": "55369",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4095759/",
        "id": "4095759",
        "name": null,
        "latitude": "45.0918809",
        "longitude": "-93.42233299999998"
      },
      {
        "address": {
          "address_1": "5640 Cedar Lake Rd",
          "address_2": null,
          "city": "Saint Louis Park",
          "region": "MN",
          "postal_code": "55416",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4144893/",
        "id": "4144893",
        "name": "PetSmart - St Louis Park",
        "latitude": "44.9637693",
        "longitude": "-93.35231329999999"
      },
      {
        "address": {
          "address_1": "1640 New Brighton Boulevard",
          "address_2": null,
          "city": "Minneapolis",
          "region": "MN",
          "postal_code": "55413",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4274275/",
        "id": "4274275",
        "name": "PetSmart Minneapolis (Quarry) #460",
        "latitude": "45.0043877",
        "longitude": "-93.2280475"
      },
      {
        "address": {
          "address_1": "12500 Highway 23",
          "address_2": null,
          "city": "Milaca",
          "region": "MN",
          "postal_code": "56353",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4274617/",
        "id": "4274617",
        "name": "Koch's Hardware Hank",
        "latitude": "45.7461621",
        "longitude": "-93.6686388"
      },
      {
        "address": {
          "address_1": "620 South Rum River Drive",
          "address_2": null,
          "city": "Princeton",
          "region": "MN",
          "postal_code": "55371",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4314639/",
        "id": "4314639",
        "name": "Paws Up 4 You",
        "latitude": "45.5627623",
        "longitude": "-93.5801611"
      },
      {
        "address": {
          "address_1": "11200 Fountains Drive",
          "address_2": null,
          "city": "Maple Grove",
          "region": "MN",
          "postal_code": "55369",
          "country": "US",
          "latitude": null,
          "longitude": null
        },
        "resource_uri": "https://www.eventbriteapi.com/v3/venues/4400837/",
        "id": "4400837",
        "name": "PetSmart: Maple Grove",
        "latitude": "45.0914929",
        "longitude": "-93.42324229999997"
      }
    ];

    beforeEach(function (done) {
      /* Configure stub */
      var serviceStub = {
        getVenues: function (callback, errorCallback) {
          callback(venues);
        },
        createVenue: function (venue, callback, errorCallback) {
          callback({ id: 1234});
        }
      };

      venueCache = new VenueCache(serviceStub);
      done();
    });

    it('Find one that I am looking for', function (done) {
      venueCache.search({ "location": { "street": "11200 Fountains Drive" } }, function(venue_id) {
        expect(venue_id).to.equal("4400837");
        done();
      });
    });

    it('Create a new one', function (done) {
      var input = {
        "name": "PetSmart",
        "location": {
          "city": "Waite Park",
          "country": "United States",
          "latitude": 45.5495682,
          "longitude": -94.2211914,
          "state": "MN",
          "street": "320 2nd St S",
          "zip": "56387"
        }
      };

      venueCache.search(input, function(venue_id) {
        expect(venue_id).to.equal(1234);
        done();
      });
    });
  });

  // TODO: Handle error here
});
