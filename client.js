var awsIot = require('aws-iot-device-sdk');

var message = 'none';

var device = awsIot.device({
    keyPath: './certs/e50c2556e2-private.pem.key',
    certPath: './certs/e50c2556e2-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
    clientId: '111111',
    region: 'us-east-1' 
});

device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('topic_query');
  });

device
  .on('message', function(topic, payload) {
    message = payload.toString();
    console.log(message);
  });
