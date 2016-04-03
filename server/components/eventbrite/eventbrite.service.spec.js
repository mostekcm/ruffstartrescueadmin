'use strict';

var app = require('../..');
var Service = require('./eventbrite.service');

describe('Eventbrite Service Unit Tests', function () {

  describe('test get venues: multi-page', function () {
    var service1, service2, pages;
    pages = [
      [
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
        }
      ], [
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
        }
      ], [
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
      ]
    ];

    beforeEach(function (done) {
      /* Configure stub */
      var restStub1 = {
        get: function (host, endpoint, token, data, success) {
          success({
            "pagination": {
              "object_count": pages[0].length + pages[1].length + pages[2].length,
              "page_number": data.page,
              "page_size": pages[data.page - 1].length,
              "page_count": pages.length
            },
            "venues": pages[data.page - 1]
          });
        },
        post: function (host, endpoint, token, data, success) {
          success(data.venue);
        }
      };
      var restStub2 = {
        get: function (host, endpoint, token, data, success) {
          success({
            "pagination": {
              "object_count": pages[0].length,
              "page_number": data.page,
              "page_size": pages[0].length,
              "page_count": 1
            },
            "venues": pages[0]
          });
        }
      };

      service1 = new Service(restStub1);
      service2 = new Service(restStub2);
      done();
    });

    it('Make sure we get all items from all pages', function (done) {
      var targetArray = pages[0].concat(pages[1]);
      targetArray = targetArray.concat(pages[2]);
      service1.getVenues(
        function (data) {
          expect(data).deep.equal(targetArray);
          done();
        }
      );
    });

    it('Single page', function (done) {
      service2.getVenues(
        function (data) {
          expect(data).deep.equal(pages[0]);
          done();
        }
      );
    });

    it('Check create method', function (done) {
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
      var target = {
        "address": {
          "address_1": input.location.street,
          "city": input.location.city,
          "region": input.location.state,
          "postal_code": input.location.zip,
          "latitude" : input.location.latitude,
          "longitude" : input.location.longitude,
        },
        "name": input.name
      };
      service1.createVenue(input,
        function (venue) {
          expect(venue).deep.equal(target);
          done();
        }
      );
    });

  });

  // TODO: Handle error here
});
