// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/szztTszPp-8

// module aliases
var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint;

var engine;
var world;
var particles = [];
var boundaries = [];

var ground;
var circleBlob;

function setup() {
  createCanvas(1600, 900);
 
  engine = Engine.create();
  world = engine.world;
  //Engine.run(engine);

  const xStart = 600;
  const yStart = 100;

  var prev = null;
  for (var x = 200; x < 400; x += 10) {
    var fixed = false;
    if (!prev) {
      fixed = true;
    }
    var p = new Particle(xStart, yStart, 3, fixed);
    // var p2 = new Particle(200, 150, 10);
    particles.push(p);

    if (prev) {
      var options = {
        bodyA: p.body,
        bodyB: prev.body,
        length: 10,
        stiffness: 0.7
      };
      var constraint = Constraint.create(options);
      World.add(world, constraint);
    }

    prev = p;
  }

  boundaries.push(new Boundary(200, height, width, 50, 0));

  circleBlob = document.createElement('div');
  circleBlob.className = 'circle-blob';
  document.getElementsByTagName('body')[0].appendChild(circleBlob);
  // circleBlob.innerHTML = '<img src="https://cdn.pixabay.com/photo/2013/07/13/09/38/sphere-155819_960_720.png" class="circle-image">okay</img>';
  circleBlob.innerHTML = 'TASK 1';
  console.log(circleBlob)
}

// function keyPressed() {
//   if (key == ' ') {
//   }
// }

// function mouseDragged() {
//   circles.push(new Circle(mouseX, mouseY, random(5, 10)));
// }

function draw() {
    background: 'transparent';
    wireframeBackground: 'transparent';
  background(200,200,250);
  Engine.update(engine);
  for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    // particles[i].body.position.x = mouseX;
  }

  const lastParticle = particles.reduce((prev, cur) => {
    line(prev.body.position.x, prev.body.position.y, cur.body.position.x, cur.body.position.y);
    
    return cur;
  })
  
  circleBlob.style.top = lastParticle.body.position.y.toString().concat('px');
  circleBlob.style.left = (lastParticle.body.position.x - 65).toString().concat('px');

  
  // circleBlob.style.left = lastParticle.body.position.x - 27;
  char_length=circleBlob.innerHTML.length

  // console.log(circleBlob.style.top)

  // circleBlob.style.left = lastParticle.body.position.x - 41;
  if(char_length>0){
    if(char_length<20){
      var minimize= 25 + (char_length*0.9);
      circleBlob.style.left = lastParticle.body.position.x - minimize;
    } else if(char_length>=20 && char_length<40 ){
      var minimize= 25 + (char_length*2);
      circleBlob.style.left = lastParticle.body.position.x - minimize;
    }
    else if(char_length>=40){
      var minimize= 25 + (char_length*2.9);
      circleBlob.style.left = lastParticle.body.position.x - minimize;
    }
    
  }
}
