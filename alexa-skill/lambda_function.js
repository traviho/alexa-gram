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
	'QueryIntent': function () {
		const slots = this.event.request.intent.slots;
		const payload = slots.animal.value || slots.actor.value || slots.area.value;
		var params = {
	        topic: 'topic_query',
	        payload: payload,
	        qos: 0
	    };
	    iotdata.publish(params, function(err, data){
	        if(err){
	            console.log(err);
	        }	
	        else{
	            console.log("success");
	        }
	    });
    }
};
