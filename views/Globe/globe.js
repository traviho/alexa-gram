if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, scene, renderer, effect;
var group;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add( group );

    var light = new THREE.AmbientLight( 0x404040 , 4); // soft white light
    scene.add( light );

    var clouds = createClouds(2, 320);
    scene.add(clouds)

    var geometry = new THREE.SphereGeometry( 3, 32, 32 );

    for ( var i = 0; i < geometry.faces.length; i += 2 ) {

        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );

    }

  var cube = createSphere(2, 32);
      group.add( cube );
      group.add(clouds);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );

    effect = new THREE.PeppersGhostEffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.cameraDistance = 5;

    window.addEventListener( 'resize', onWindowResize, false );

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    camera.lookAt( scene.position );
    Leap.loop({
          // frame callback is run before individual frame components
          frame: function(frame){
            console.log("Hello");
          },
          // hand callbacks are run once for each hand in the frame
          hand: function(hand){
            //out.innerHTML += "Hand: " + hand.id + ' &nbsp;roll: ' + Math.round(hand.roll() * TO_DEG) + '°<br/>'
            var rotationAngle = hand.yaw();
            var pitch  = hand.pitch();
            group.rotation.y = 4*rotationAngle;
          }
        });

    effect.render( scene, camera );

}

function createSphere(radius, segments) {
return new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshPhongMaterial({
    map:         THREE.ImageUtils.loadTexture('./Globe/2_no_clouds_4k.jpg'),
    bumpMap:     THREE.ImageUtils.loadTexture('./Globe/elev_bump_4k.jpg'),
    bumpScale:   0.005,
    specularMap: THREE.ImageUtils.loadTexture('./Globe/water_4k.png'),
    specular:    new THREE.Color('grey')
  })
);
}

function createClouds(radius, segments) {
return new THREE.Mesh(
  new THREE.SphereGeometry(radius + 0.003, segments, segments),
  new THREE.MeshPhongMaterial({
    map:         THREE.ImageUtils.loadTexture('./Globe/fair_clouds_4k.png'),
    transparent: true
  })
);
}

function createStars(radius, segments) {
return new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshBasicMaterial({
    map:  THREE.ImageUtils.loadTexture('./Globe/images/galaxy_starfield.png'),
    side: THREE.BackSide
  })
);
}
