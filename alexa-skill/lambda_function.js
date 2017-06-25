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
        this.emit(':tell', 'Opening 3D Earth!');
    },
	'QueryIntent': function () {
		const slots = this.event.request.intent.slots;
		const payload = (slots.Animal.value || slots.Country.value || slots.Dessert.value ||
			slots.DeviceType.value || slots.Drink.value || slots.Food.value ||
			slots.LandmarksOrHistoricalBuildings.value || slots.Person.value);
		if (!payload){
			this.emit(':tell', 'I could not find what you are looking for!');
		}
		var params = {
	        topic: 'topic_query',
	        payload: payload,
	        qos: 0
	    };
	    iotdata.publish(params, function(err, data){
	        context.done(err, data);
	    });
	    this.emit(':tell', 'Pulling that up for you!');
    }
};
