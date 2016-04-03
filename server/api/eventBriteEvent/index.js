'use strict';

var express = require('express');
var controller = require('./eventBriteEvent.controller');

var router = express.Router();

router.post('/', controller.create);
router.delete('/', controller.destroy);

module.exports = router;
