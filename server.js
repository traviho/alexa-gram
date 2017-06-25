var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('view engine', 'ejs');
var $ = require('jquery');
var awsIot = require('aws-iot-device-sdk');
app.use(express.static(__dirname + '/'));

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

    if (message === "spin-the-earth") {
      io.emit('spin-the-earth');
    } else if (message === "draw-something") {
      io.emit('draw-something', drawingHTML);
    } else if (message === "go-to-home") {
      io.emit('image url', "../Alexagram-Welcome-Screen.png")
    } else {
      searchImage(message);
    }
  });

var drawingHTML = `
  <div class="container">
      <div class="draw-canvas" id="north"></div>

      <div class="draw-canvas" id="east" style="transform: rotate(90deg) translate(-3vh,0px)"></div>

      <div class="draw-canvas" id="west" style="transform: rotate(-90deg) translate(3vh,0px)"></div>
  </div>

  <div id="south-div-footer">
    <div id="south-div-center">
      <div class="draw-canvas" id="south"></div>
    </div>
  </div>

  <script src="./Drawing/js/lib/leap.js"></script>
  <script src='./Drawing/js/lib/d3.v3.min.js'></script>
  <script src='./Drawing/draw.js'></script>
`;

function searchImage(message) {
  const GoogleImages = require('google-images');

  const client = new GoogleImages('015229362472567437820:iww7-gn94zm', 'AIzaSyDVEreFwxOs-RMOUArD5AkcEuA-6R99aW8');

  var URLs = [];
  const searchString = message + ' transparent';
  client.search(searchString)
  	.then(images => {
  		/*
  		[{
  			"url": "http://steveangello.com/boss.jpg",
  			"type": "image/jpeg",
  			"width": 1024,
  			"height": 768,
  			"size": 102451,
  			"thumbnail": {
  				"url": "http://steveangello.com/thumbnail.jpg",
  				"width": 512,
  				"height": 512
  			}
  		}]
  		 */

       images.forEach(function(imgInfo) {
         URLs.push(imgInfo.url);
       })

       imageUrl = URLs[0];
       URLs.forEach(function(url) {
         if (url.substr(-4) == ".png") {
           imageUrl = url;
         }
       });

       console.log(imageUrl);
       io.emit('image url', imageUrl);

       // make save image function call here
  	});

  // search for certain size
  // client.search('Steve Angello', {size: 'large'});
}

var imgUrl = "../Alexagram-Welcome-Screen.png"

app.get('/', function(req, res){
  res.render('hologram', {
    url: imgUrl
  });
});

http.listen(3000, function() {
    console.log('Alexa-gram listening on port 3000!');
});
