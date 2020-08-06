const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particles;

const lineLengthModifier = 13000;
const mouseTrail = [];
// change number of Particles, lower is more
const particleModifier = 100;
// define mouse and get mouse position
let mouse = {
	x: null,
	y: null,
  radius: ((canvas.height/180) * (canvas.width/180))
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + window.scrollX;
        mouse.y = event.y + window.scrollY;
        var Dot = new TrailDot(mouse.x, mouse.y);
        Dot.add();
        setTimeout(Dot.delete, Dot.trailDuration);
        // check mouse position/particle position - collision detection
        mouseRepell();
    });


function mouseRepell(){
    for (const p of particles) {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + p.size){
            if(mouse.x < this.x){
                p.x+= 1.5;
            } else if (mouse.x > p.x){
                p.x-= 1.5;
            };

            if (mouse.y < p.y){
                p.y+= 1.5;
            } else if (mouse.y > p.y){
                p.y-= 1.5;
            };

            if (Math.abs(dx) > 2.5 || Math.abs(dy) > 2.5){
                if (dy == 0){
                    dy = 0.001
                };
                if (Math.abs(dx) > Math.abs(dy)){
                    var divident = Math.abs(dx) / 2.5;
                } else {
                    var divident = Math.abs(dy) / 2.5;
                };
                dx /= divident;
                dy /= divident;
            }
            p.directionX = -dx;
            p.directionY = -dy;
        }
    }
}
// create Particle
class Particle {
    constructor(id, x, y, directionX, directionY, size, colour) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.colour = colour;
        this.speed = numOfParticles / 300;
    }
    // draw individual particles
    draw() {
        ctx.beginPath();
        ctx.arc(parseInt(this.x),parseInt(this.y),this.size,0,Math.PI * 2, false);

        ctx.fillStyle = this.colour;
	    ctx.fill();
    }

    // check particle position, check mouse position, move and draw the particle
    update() {
        // check if particle is still on canvas
        if (this.x + this.size > canvas.width) {
            this.x -= canvas.width;
        } else if(this.x - this.size < 0){
		    this.x += canvas.width;
	    };
        if (this.y + this.size > canvas.height) {
            this.y -= canvas.height;
        } else if(this.y - this.size < 0){
		    this.y += canvas.height;
	    };

        // move particle
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
        
        this.draw();
    }
}

class TrailDot {
    constructor(x, y){
        this.trailDuration = 100;
        this.mouseTrailOffset = [7,7];
        this.x = x + this.mouseTrailOffset[0];
        this.y = y + this.mouseTrailOffset[1];
    }
    add(){
        mouseTrail.push(this);
    }
    delete(){
        mouseTrail.splice(0, 1);
    }
}
// check if particles are close enough to draw line between them
function connect() {
    // Sort paricle array according to x position
    particlesX.sort((a, b) => (a.x > b.x) ? 1 : -1);

    for (let i = 0; i < particles.length; i++){
        let particlesInRange = []
        let p = particlesX[i]
        // Append all subsequent dots to a list that are within the radius on the x axis
        for (let j = i + 1; j < particles.length; j++){
            let p2 = particlesX[j];
            if (p2.x - p.x < radius){
                particlesInRange.push(p2);
            } else {
                // Break loop. Because the loop is sorted, all further array elements are not within the range anymore
                break;
            };
        };
        // Remove all elements that are not within the radius on the y axis
        particlesInRange = particlesInRange.filter(x => Math.abs(x.y - particlesX[i].y) < radius);

        // Draw connections to all remaining dots
        for (p of particlesInRange){
            let dist = Math.sqrt(Math.pow(particlesX[i].x - p.x, 2) + Math.pow(particlesX[i].y - p.y, 2));
            let opacityValue = 1-(dist/radius);
            ctx.strokeStyle='rgba(235,181,255,' + opacityValue +')';
            // Create gradient
            // var gradient = ctx.createLinearGradient(Math.floor(particlesX[i].x), Math.floor(particlesX[i].y), Math.floor(p.x), Math.floor(p.y));
            // gradient.addColorStop("0", particlesX[i].colour.replace('rgb', 'rgba').replace(')', ',' + opacityValue + ')'));
            // gradient.addColorStop("1.0", p.colour.replace('rgb', 'rgba').replace(')', ',' + opacityValue + ')'));
            // // Fill with gradient
            // ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.moveTo(Math.floor(particlesX[i].x), Math.floor(particlesX[i].y));
            ctx.lineTo(Math.floor(p.x), Math.floor(p.y));
            ctx.stroke();
        }

        
    }

}

// create particle array 
function init(){
    radius = Math.sqrt(canvas.height*canvas.height)/6;
    particles = [];
    //numOfParticles = (canvas.height * canvas.width) / (particleModifier * 100);
    numOfParticles = 150;
    // var sizeMult = Math.sqrt(canvas.height * canvas.width) / (1000)
    var sizeMult = 1 + canvas.height * canvas.width * 0.4 / 800000
    for (let i = 0; i < numOfParticles; i++){
        let size = (Math.random() * 5) + 1;
        size *= sizeMult;
        
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        
        if(Math.random()>0.2){

            var colour = `rgb(
                ${(Math.random() * (220 - 102) + 102)},
                0,
                ${(Math.random() * (255 - 153) + 153 )})`;
            // let colour = `rgb(
            //     ${(Math.random() * 256)},
            //     ${(Math.random() * 256)},
            //     ${(Math.random() * 256)})`;
        } else {
            var colour = `rgb(
                ${(Math.random() * (255 - 240) + 240)},
                ${(Math.random() * (150 - 120) + 120)},
                ${(Math.random() * (60 - 20) + 20 )})`;
        }
        particles.push(new Particle(i, x, y, directionX, directionY, size, colour));
    }
    //Create copy of particle array
    particlesX = [...particles];

}

function trail(){
    if (mouseTrail.length > 0){
        for (let i = 0; i < mouseTrail.length; i++) {
            const point = mouseTrail[i];

            if (i == mouseTrail.length - 1){
                var connection = (mouse.x == undefined) ? point : new TrailDot(mouse.x, mouse.y);
            } else {
                var connection = mouseTrail[i+1];
            };
            let opacityValue = 0.2 + 0.8 * (i / (mouseTrail.length-1));
            ctx.strokeStyle='rgba(255,255,255,' + opacityValue +')';
            ctx.beginPath();
            ctx.lineWidth = 0.5 +  2.5 * (i / (mouseTrail.length-1));
            ctx.moveTo(Math.floor(point.x), Math.floor(point.y));
            ctx.lineTo(Math.floor(connection.x), Math.floor(connection.y));
            ctx.stroke();
            
        }
    }
}

// create animation loop
function animate(){
    
	ctx.clearRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < particles.length; i++){
		particles[i].update();
    }
    connect();
    trail();
    //setTimeout(animate,12.5);
    requestAnimationFrame(animate)
}
init();
animate();


// empty and refill particles every time window changes size + change canvas size
$(window).resize(
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 115) * (canvas.width / 115));
		init();
	}
)
// when mouse leaves canvas set to undefined
$(window).mouseout(
	function(){
		mouse.x = undefined;
	    mouse.y = undefined;
        console.log('mouseout');
	}
)
