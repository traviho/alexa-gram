'use strict';
var AWS = require('aws-sdk');
var Alexa = require("alexa-sdk");

const APP_ID = amzn1.ask.skill.65f80586-58d3-4b1e-a4f3-ebee54282f55

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
	'HelloIntent': function () {
        this.emit(':tell', 'Hello World!');
    }
}
