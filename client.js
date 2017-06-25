var awsIot = require('aws-iot-device-sdk');
var request = require('request');
var fs = require('file-system');

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
    searchImage(message);
  });

function searchImage(message) {
  const GoogleImages = require('google-images');
  const client = new GoogleImages('015229362472567437820:iww7-gn94zm', 'AIzaSyDVEreFwxOs-RMOUArD5AkcEuA-6R99aW8');

  var URLs = [];
  const searchString = message + ' transparent';
  client.search(searchString)
  	.then(images => {
        images.forEach(function(imgInfo) {
            URLs.push(imgInfo.url);
        })
        var imageUrl = URLs[0];
        URLs.forEach(function(url) {
            if (url.substr(-4) == ".png") {
                imageUrl = url;
            }
        });
        console.log(imageUrl);
        const options = {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true
        };
        request(imageUrl).pipe(fs.createWriteStream("img/pic.png", options));
  	});
}
