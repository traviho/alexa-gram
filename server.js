var express = require('express');
var app = express();
var request = require('request');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('view engine', 'ejs');
var $ = require('jquery');
var awsIot = require('aws-iot-device-sdk');
var Client = require('node-rest-client').Client;
 
var client = new Client();
 

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
    } else if (message === "meme-gifs") {
      searchImage('meme-gifs');
    } else if (message.includes("weather")) {
 var str = message.replace(/\s/g, '_');
 str = str.substr(8);
 getWeather(str);
    }else{
      searchImage(message);
    }
  });
function getWeather(message){
  console.log("http://api.wunderground.com/api/58fb1eddb9fd5550/conditions/q/" + message +".json");
client.get("http://api.wunderground.com/api/58fb1eddb9fd5550/conditions/q/CA/" + message +".json", function (data, response) {
    // parsed response body as js object 
    console.log(data);
    console.log(data.current_observation.temp_f); 
    console.log(data.current_observation.weather); 
    if (data.current_observation.precip_today_metric > 0)
    imgUrl = "https://media.giphy.com/media/PbOaO2fedzQLm/giphy.gif"
    else if (data.current_observation.weather == "Overcast"){
      imgUrl = "https://media.giphy.com/media/3o7rc6sa2RvKo8K5EI/giphy.gif"
    }else {
      imgUrl = "https://media.giphy.com/media/10d3NDzD40xb0s/giphy.gif"
    }
});
}


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
       if (message === "meme-gifs") {
        imageUrl = 'http://i.imgur.com/E7YAB51.gif';
       }
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
