// Setup Leap loop with frame callback functions
var controllerOptions = { enableGestures: true },
    width = 300,
    height = 300,

    canvases = {};
    for ( i = 0; i < 5; i++) {

    }
    canvas = d3.select('div#north')
        .append('canvas').node(),
    canvas2 = d3.select('div#east')
        .append('canvas').node(),
    canvas3 = d3.select('div#west')
        .append('canvas').node(),
    canvas4 = d3.select('div#south')
        .append('canvas').node(),
    canvas.style.width = '30vh',
    canvas.style.height = '30vh',
    canvas2.style.width = '30vh',
    canvas2.style.height = '30vh',
    canvas3.style.width = '30vh',
    canvas3.style.height = '30vh',
    canvas4.style.width = '30vh',
    canvas4.style.height = '30vh',
    ctx = canvas.getContext('2d'),
    ctx2 = canvas2.getContext('2d'),
    ctx3 = canvas3.getContext('2d'),
    before3 = {},
    after3 = {},
    before2 = {},
    after2 = {},
    before = {},
    after = {},
    color = d3.scale.category20();

ctx.lineWidth = 25;
ctx.translate(width/2, height);

ctx2.lineWidth = 25;
ctx2.translate(width/2, height);

ctx3.lineWidth = 25;
ctx3.translate(width/2, height);

function draw() {
    var a, b, a2, b2, a3, b3;

    for (var id in after) {
      console.log("The ID is: " + id)
        b = before[id],
        a = after[id];

        b2 = before2[id],
        a2 = after2[id];

        b3 = before2[id],
        a3 = after2[id];

        if (!b && !b2 && !b3) continue;

        ctx.strokeStyle = color(id);
        ctx.moveTo(2.5*b.tipPosition.x, 1.5*-b.tipPosition.y);
        ctx.lineTo(2.5*a.tipPosition.x, 1.5*-a.tipPosition.y);
        ctx.stroke();
        ctx.beginPath();

        ctx2.strokeStyle = color(id);
        ctx2.moveTo(2.5*b2.tipPosition.x, 1.5*-b2.tipPosition.y);
        ctx2.lineTo(2.5*a2.tipPosition.x, 1.5*-a2.tipPosition.y);
        ctx2.stroke();
        ctx2.beginPath();

        ctx3.strokeStyle = color(id);
        ctx3.moveTo(2.5*b3.tipPosition.x, 1.5*-b3.tipPosition.y);
        ctx3.lineTo(2.5*a3.tipPosition.x, 1.5*-a3.tipPosition.y);
        ctx3.stroke();
        ctx3.beginPath();
        break;
    }

    before = after;
    before2 = after2;
    before3 = after3;

}

Leap.loop(controllerOptions, function(frame, done) {
    after = {};
    after2 = {};
    after3 = {};

    for (var i = 0; i < frame.pointables.length; i++) {
        after[frame.pointables[i].id] = frame.pointables[i];
        after2[frame.pointables[i].id] = frame.pointables[i];
        after3[frame.pointables[i].id] = frame.pointables[i];
    }
    draw();
    done();
});
