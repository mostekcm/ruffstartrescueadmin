'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  facebookUrl: String,
  eventbriteUrl: String,
  status: String,
  attendees: [{ foster: String, animal: String, image: String, status: String }],
  active: Boolean
});

export default mongoose.model('Event', EventSchema);
