'use strict';

var express = require('express');
var controller = require('./pattern.controller');

var router = express.Router();

router.post('/next-generation', controller.nextGeneration);

module.exports = router;
