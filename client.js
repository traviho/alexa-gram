(function () {
  // Grabbing the HTML element for rendering the globe
  var globeElement = document.getElementById('globe');

  // Grabbing size of the screen
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Setting up Three.js
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;

  // Earth parameters
  var radius   = 0.5,
    segments = 32,
    rotation = 6;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

  scene.add(new THREE.AmbientLight(0x333333));
  var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

  var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation;
	scene.add(sphere)
  var clouds = createClouds(radius, segments);
  clouds.rotation.y = rotation;
  scene.add(clouds)

  var stars = createStars(90, 64);
  scene.add(stars);

  //var controls = new THREE.TrackballControls(camera);

  globeElement.appendChild(renderer.domElement);

  render();

  function render() {
    //controls.update();
    //sphere.rotation.y += 0.0005;
    //clouds.rotation.y += 0.0005;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  Leap.loop({
        // frame callback is run before individual frame components
        frame: function(frame){
          console.log("Hello");
        },
        // hand callbacks are run once for each hand in the frame
        hand: function(hand){
          //out.innerHTML += "Hand: " + hand.id + ' &nbsp;roll: ' + Math.round(hand.roll() * TO_DEG) + '°<br/>'
          var rotation = hand.yaw();
          var pitch  = hand.pitch();
          sphere.rotation.y = 4*rotation;
          clouds.rotation.y = 4*rotation;
          //sphere.rotation.x = 4*pitch;
        //  clouds.rotation.x = 4*pitch;
          console.log(rotation);
        }
      });

function createSphere(radius, segments) {
return new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshPhongMaterial({
    map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
    bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
    bumpScale:   0.005,
    specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
    specular:    new THREE.Color('grey')
  })
);
}

function createClouds(radius, segments) {
return new THREE.Mesh(
  new THREE.SphereGeometry(radius + 0.003, segments, segments),
  new THREE.MeshPhongMaterial({
    map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
    transparent: true
  })
);
}

function createStars(radius, segments) {
return new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshBasicMaterial({
    map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
    side: THREE.BackSide
  })
);
}

}());
