const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particles;

const lineLengthModifier = 13000;
// change number of Particles, lower is more
const particleModifier = 50;

// define mouse and get mouse position
let mouse = {
	x: null,
	y: null,
  radius: ((canvas.height/90) * (canvas.width/90))
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
});

// create Particle
class Particle {
    constructor(x, y, directionX, directionY, size, colour) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.colour = colour;
        this.speedX = this.directionX;
        this.speedY = this.directionY;
    }
    // draw individual particles
    draw() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2, false);

        ctx.fillStyle = 'white';
	    ctx.fill();
    }

    // check particle position, check mouse position, move and draw the particle
    update() {
        // check if particle is still on canvas
        if (this.x > canvas.width || this.x < 0){
			this.directionX = -this.directionX;
            this.speedX = this.directionX;
        } 
        if (this.y + this.size > canvas.height || this.y - this.size < 0){
		    this.directionY = -this.directionY;
            this.speedY = this.directionY;
	    }
        // check mouse position/particle position - collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size*10){
                this.x+= 10;
            }
            if (mouse.x > this.x && this.x > this.size*10){
                this.x-= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size*10){
                this.y+= 10;
            }
            if (mouse.y > this.y && this.y > this.size*10){
                this.y-= 10;
            }
            this.directionX = -this.directionX;
            this.speedX = this.directionX;
            this.directionY = -this.directionY;
            this.speedY = this.directionY;
            
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++){
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            +   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            if  (distance < (canvas.width/7) * (canvas.height/7))
            {   
                opacityValue = 1-(distance/ lineLengthModifier);
                ctx.strokeStyle='rgba(255,255,255,' + opacityValue +')';
                ctx.beginPath();
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();

            }    
    }
    }
}

// create particle array 
function init(){
    particles = [];
    let numOfParticles = (canvas.height * canvas.width) / (particleModifier * 100);
    console.log(numOfParticles);
    for (let i = 0; i < numOfParticles; i++){
        let size = (Math.random() * 5) + 1;
        
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        
        let colour = 'gold';
        particles.push(new Particle(x, y, directionX, directionY, size, colour));
    }
}

// create animation loop
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, innerWidth, innerHeight);
	
	for (let i = 0; i < particles.length; i++){
		particles[i].update();
	}
    connect();
}
init();
animate();


// empty and refill particles every time window changes size + change canvas size
window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 90) * (canvas.width / 90));
		init();
	}
)
// when mouse leaves canvas set to undefined
window.addEventListener('mouseout',
	function(){
		mouse.x = undefined;
	    mouse.y = undefined;
        console.log('mouseout');
	}
)