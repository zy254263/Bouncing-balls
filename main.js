var para = document.querySelector('p');
var count = 0;
// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// define Ball constructor
class Shape{
    constructor(x,y,velX,velY,exists){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}

class Ball extends Shape{
    constructor(x,y,velX,velY,exists,color,size){
    super(x,y,velX,velY,exists);
    this.color = color;
    this.size = size;
    }

// define ball draw method
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };
// define ball update method
    update() {
        if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
    };

// define ball collision detection
    collisionDetect() {
        for(var j = 0; j < balls.length; j++) {
            if(!(this === balls[j])) {
              var dx = this.x - balls[j].x;
              var dy = this.y - balls[j].y;
              var distance = Math.sqrt(dx * dx + dy * dy);
        
              if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
              }
            }
          }
    };

}

class EvilCircle extends Shape{
    constructor(x,y,velX,velY,exists,color,size){
        super(x,y,velX,velY,exists);
        this.color = color;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    };
    checkBounds() {
        if((this.x + this.size) >= width) {
            this.x -= this.size;
          }
        
          if((this.x - this.size) <= 0) {
            this.x += this.size;
          }
        
          if((this.y + this.size) >= height) {
            this.y -= this.size;
          }
        
          if((this.y - this.size) <= 0) {
            this.y += this.size;
          }
    };
    setControls() {
        var _this = this;
        window.onkeydown = function(e) {
            if (e.keyCode === 65) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
        }
    };
    collisionDetect() {
        for(var j = 0; j < balls.length; j++) {
            if(balls[j].exists) {
              var dx = this.x - balls[j].x;
              var dy = this.y - balls[j].y;
              var distance = Math.sqrt(dx * dx + dy * dy);
        
              if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                para.textContent = 'Ball count: ' + count;
              }
            }
          }
    };
}

// define array to store balls and populate it

var balls = [];

while(balls.length < 25) {
  var size = random(10,20);
  var ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

var evil = new EvilCircle(random(0,width), random(0,height),20,20,true,'white',10);
evil.setControls();
// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(var i = 0; i < balls.length; i++) {
    if(balls[i].exists){
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    }
  }
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  requestAnimationFrame(loop);
}



loop();