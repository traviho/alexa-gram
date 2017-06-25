'use strict';
var AWS = require('aws-sdk');
var Alexa = require("alexa-sdk");

var iotdata = new AWS.IotData({endpoint: 'a38ch8r6fxorip.iot.us-east-1.amazonaws.com'});

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
	'EarthIntent': function () {
		const self = this;
        var params = {
	        topic: 'topic_query',
	        payload: "spin-the-earth",
	        qos: 0
	    };
	    iotdata.publish(params, function(err, data){
	        self.emit(':tell', 'pulling up Earth!');
	    });
    },
    'MovieIntent': function () {
        const self = this;
        var params = {
	        topic: 'topic_query',
	        payload: "222",
	        qos: 0
	    };
	    iotdata.publish(params, function(err, data){
	        self.emit(':tell', 'Searching movie trailers!');
	    });
    },
    'WeatherIntent': function () {
        const self = this;
        var payload = 'weather-' + this.event.request.intent.slots.city.value;
        var params = {
	        topic: 'topic_query',
	        payload: payload,
	        qos: 0
	    };
	    iotdata.publish(params, function(err, data){
	        self.emit(':tell', 'This is the weather in ' + payload + '!');
	    });
    },
	'QueryIntent': function () {
		const self = this;
		const slots = this.event.request.intent.slots;
		var payload = slots.animal.value || slots.actor.value || slots.food.value || slots.bodyPart.value;
		if (slots.bodyPart.value) {
		    payload = 'human ' + payload + ' model';
		}
		if (!payload){
			self.emit(':tell', 'I could not find what you are looking for!');
		}
		var params = {
	        topic: 'topic_query',
	        payload: payload,
	        qos: 0
	    };
	    iotdata.publish(params, function(err, data){
	        self.emit(':tell', 'pulling that up for you!');
	    });
    }
};
