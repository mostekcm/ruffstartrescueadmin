'use strict';

var express = require('express');
var controller = require('./fetchEventsFromFacebook.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.sync);

module.exports = router;
