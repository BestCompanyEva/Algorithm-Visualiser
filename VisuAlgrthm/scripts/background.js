"use strict";
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT


const number = 500;
const speed = 2;
const linkWidth = 0.5;
const linkDistance = 150;
let size;
var repulseDistance = 100;
const linkDistance2 = (0.7 * linkDistance) ** 2;
const repulseDistance2 = repulseDistance ** 2;
Math.TAU = Math.PI * 2;
var pColour = "#8A2BE2";
const linkColour = "#FFF";

const bounce = false;

const mouse = { x: 0, y: 0}
let particles = [];
const candidates = [];
var W, H;
const links = [[], [], [], []];
const linkBatchAlphas = [0.1, 0.3, 0.7, 0.9];
const linkBatches = links.length;
const linkPool = [];

let quadTree;
let boundary;
//const mouseTrail = [];

W = canvas.width;
H = canvas.height;
var offsetX, offsetY = W, H;


canvas.addEventListener('mousemove', event => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    
    // var Dot = new TrailDot(mouse.x, mouse.y);
    // Dot.add();
    // setTimeout(Dot.delete, Dot.trailDuration);
})
canvas.addEventListener('mouseleave', () =>{
    // when mouse leaves canvas set to undefined
    mouse.x = null;
	mouse.y = null;
})

window.addEventListener('resize', setCanvasSize);

setTimeout(start, 42);
function start() {
    initParticle();
    setCanvasSize();
    animate();
}

	
function initParticle(){
    quadTree = new QuadTree();
    for (let i = 0; i < number; i++) {
        
        size = Math.random() * (15 - 5) + 5 + canvas.height * canvas.width * 0.0000005;
        if(Math.random()>0.2){

            var pColour = `rgb(
                ${(Math.random() * (220 - 102) + 102)},
                0,
                ${(Math.random() * (255 - 153) + 153 )})`;
            // let colour = `rgb(
            //     ${(Math.random() * 256)},
            //     ${(Math.random() * 256)},
            //     ${(Math.random() * 256)})`;
        } else {
            var pColour = `rgb(
                ${(Math.random() * (255 - 240) + 240)},
                ${(Math.random() * (150 - 120) + 120)},
                ${(Math.random() * (60 - 20) + 20 )})`;
        }
        
        particles.push(new Particle(canvas, size, pColour));
    }
}
// create animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateParticles();
    updateLines();
    
    //updateTrail();
    //setTimeout(animate,12.5);
    requestAnimationFrame(animate);
}

function updateParticles() {
    quadTree.close();
    
    
    for (const particle of particles) { 
       
        particle.update(ctx, true); 
    }
    
}
function updateLines() {
    var i, link;
    for(const p1 of particles) {
        p1.explored = true;
        const count = quadTree.query(p1, 0, candidates);
        for (i = 0; i < count; i++) {
            const p2 = candidates[i];
            if (!p2.explored) {
                link = linkPool.length ? linkPool.pop() : new Link();
                link.init(p1, candidates[i]);
                links[link.batchId].push(link);
            }
        }
    }
    var alphaIdx = 0;
    ctx.lineWidth = linkWidth;
    ctx.strokeStyle = linkColour;
    for(const l of links) {
        ctx.globalAlpha = linkBatchAlphas[alphaIdx++]; 
        
        ctx.beginPath();
        while(l.length) { linkPool.push(l.pop().addPath(ctx)) }
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}
function resetParticles() {
    quadTree = new QuadTree();
    for (const particle of particles) { particle.reset(canvas) };

}
function setCanvasSize () {
    H = canvas.height = canvas.offsetHeight;
    W = canvas.width = canvas.offsetWidth;
    resetParticles();
}

class Link {
    constructor() {  }
    init(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        this.alpha = 1 - (dx * dx + dy * dy) / linkDistance2;
        this.batchId = this.alpha * linkBatches | 0;
        this.batchId = this.batchId >= linkBatches ? linkBatches : this.batchId;
    }		
    addPath(ctx) {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        return this;
    }
	
}
// create Particle
class Particle {
    constructor (canvas, r, pColour) {
        this.r = r;
        this.speedScale = speed / 2;
        this.pColour = pColour;
        this.reset(canvas, r);
    }
   
    reset(canvas, r = this.r) {
        const W = canvas.width - r * 2;
        const H = canvas.height - r * 2;
        this.x = Math.random() * W + r;
        this.y = Math.random() * H + r;
        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;
        this.quad = undefined;
        this.explored = false;

    }
	  addPath(ctx) {
          ctx.beginPath();
	      ctx.moveTo(this.x + this.r,  this.y);
          ctx.arc(this.x,  this.y, this.r, 0, Math.TAU, false);
          ctx.fillStyle = this.pColour;
          ctx.fill();
	  }
	  near(p) {
		    return ((p.x - this.x) ** 2 + (p.y - this.y) ** 2) <= linkDistance2;
	  }
    intersects(range) {
        const xd = Math.abs(range.x - this.x);
        const yd = Math.abs(range.y - this.y);
        const r = linkDistance;
        const w = range.w;
        const h = range.h;
        if (xd > r + w || yd > r + h) { return false }
        if (xd <= w || yd <= h) { return true }
        return  ((xd - w) ** 2 + (yd - h) ** 2) <= linkDistance2;
    
    }
    update(ctx, repulse = true) { 
        this.explored = false;
        const r = this.r;
        let W, H;
        this.x += this.vx * this.speedScale;
        this.y += this.vy * this.speedScale;
        
        

        if (bounce) {
            W = ctx.canvas.width - r;
            H = ctx.canvas.height - r;
            if (this.x > W || this.x < 0) {
                this.vx = -this.vx;
            } else if (this.y > H || this.y < 0) {
                this.vy = -this.vy;
            }
        } else {
            W = ctx.canvas.width + r;
            H = ctx.canvas.height + r;
            if (this.x > W) {
                this.x = 0;
                this.y = Math.random() * (H - r);
            } else if (this.x < -r) {
                this.x = W - r;
                this.y = Math.random() * (H - r);
            }
            if (this.y > H) {
                this.y = 0
                this.x = Math.random() * (W - r);
            } else if (this.y < -r) {
                this.y = H - r;
                this.x = Math.random() * (W - r);
            }
        }
        repulse && mouse.x && this.repulse();
        this.addPath(ctx);
        quadTree.insert(this);
        this.quad && (this.quad.drawn = false)
    }
    repulse() {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;

        const dist = (dx * dx + dy * dy) ** 0.5;
        var rf = ((1 - (dist / repulseDistance) ** 2)  * 100);
            rf = (rf < 0 ? 0 : rf > 50  ? 50 : rf) / dist;
        
        var posX = this.x + dx * rf;
        var posY = this.y + dy * rf;

        if (bounce) {
            if (posX - size > 0 && posX + size < canvas.width) this.x = posX;
            if (posY - size > 0 && posY + size < canvas.height) this.y = posY;
        } else {
            this.x = posX;
            this.y = posY;
        }
    }
}


class Bounds {
    constructor(x, y, w, h) { this.init(x, y, w, h) }
    init(x,y,w,h) { 
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
        this.left = x - w;
        this.right = x + w;
        this.top = y - h;
        this.bottom = y + h;
        this.diagonal = (w * w + h * h);
    }

    contains(p) {
        return (p.x >= this.left && p.x <= this.right && p.y >= this.top && p.y <= this.bottom);
    }

    near(p) {
        if (!this.contains(p)) {
            const dx = p.x - this.x;
            const dy = p.y - this.y;
            const dist = (dx * dx + dy * dy) - this.diagonal - linkDistance2;
            return dist < 0;
        }
        return true;
    }
}

class QuadTree {
    constructor(boundary, depth = 0) {
		this.boundary = boundary || new Bounds(canvas.width / 2,canvas.height / 2,canvas.width / 2 ,canvas.height / 2);
        this.divided = false;		
        this.points = depth > 1 ? [] : null;
        this.pointCount = 0
        this.drawn = false;
        this.depth = depth;
        if(depth === 0) {   // BM67 Fix on resize
            this.subdivide();
            this.NE.subdivide();
            this.NW.subdivide();
            this.SE.subdivide();
            this.SW.subdivide();
        }


    }

    addPath() {
        const b = this.boundary;
        ctx.rect(b.left, b.top, b.w * 2, b.h * 2);
        this.drawn = true;
    }
    addToSubQuad(particle) {
        if (this.NE.insert(particle)) { return true }
        if (this.NW.insert(particle)) { return true }
        if (this.SE.insert(particle)) { return true }
        if (this.SW.insert(particle)) { return true }	
        particle.quad = undefined;		
    }
    insert(particle) {
        if (this.depth > 0 && !this.boundary.contains(particle)) { return false }
        
        if (this.depth > 1 && this.pointCount < 4) { 
            this.points[this.pointCount++] = particle;
            particle.quad = this;
            return true;
        } 
        if (!this.divided) { this.subdivide() }
        return this.addToSubQuad(particle);
    }

    subdivide() {
        if (!this.NW) {
            const x = this.boundary.x;
            const y = this.boundary.y;
            const w = this.boundary.w / 2;
            const h = this.boundary.h / 2;
            const depth = this.depth + 1;

            this.NE = new QuadTree(new Bounds(x + w, y - h, w, h), depth);
            this.NW = new QuadTree(new Bounds(x - w, y - h, w, h), depth); 
            this.SE = new QuadTree(new Bounds(x + w, y + h, w, h), depth);
            this.SW = new QuadTree(new Bounds(x - w, y + h, w, h), depth);
        } else {
            this.NE.pointCount = 0;
            this.NW.pointCount = 0;            
            this.SE.pointCount = 0;
            this.SW.pointCount = 0;            
        }

        this.divided = true;
    }
    query(part, fc, found) {
        var i = this.pointCount;
        if (this.depth === 0 || this.boundary.near(part)) {
            if (this.depth > 1) {
                while (i--) {
                    const p = this.points[i];
                    if (!p.explored && part.near(p)) { found[fc++] = p }
                }
                if (this.divided) {
                    fc = this.NE.pointCount ? this.NE.query(part, fc, found) : fc;
                    fc = this.NW.pointCount ? this.NW.query(part, fc, found) : fc;
                    fc = this.SE.pointCount ? this.SE.query(part, fc, found) : fc;
                    fc = this.SW.pointCount ? this.SW.query(part, fc, found) : fc;
                }
            } else if(this.divided) {
                fc = this.NE.query(part, fc, found);
                fc = this.NW.query(part, fc, found);
                fc = this.SE.query(part, fc, found);
                fc = this.SW.query(part, fc, found);
            }
        }
        return fc;
    }

    close() {
        if (this.divided) {
           this.NE.close();
           this.NW.close();
           this.SE.close();
           this.SW.close();
        }
      
        if (this.depth === 2 && this.divided) {
            this.NE.pointCount = 0;
            this.NW.pointCount = 0;
            this.SE.pointCount = 0;
            this.SW.pointCount = 0;
        } else if (this.depth > 2) {
            this.divided = false;
        }
    }
}    
 


// class TrailDot {
//     constructor(x, y){
//         this.trailDuration = 100;
//         this.mouseTrailOffset = [7,7];
//         this.x = x + this.mouseTrailOffset[0];
//         this.y = y + this.mouseTrailOffset[1];
//     }
//     add(){
//         mouseTrail.push(this);
//     }
//     delete(){
//         mouseTrail.splice(0, 1);
//     }
// }






// function trail(){
//     if (mouseTrail.length > 0){
//         for (let i = 0; i < mouseTrail.length; i++) {
//             const point = mouseTrail[i];

//             if (i == mouseTrail.length - 1){
//                 var connection = (mouse.x == undefined) ? point : new TrailDot(mouse.x, mouse.y);
//             } else {
//                 var connection = mouseTrail[i+1];
//             };
//             let opacityValue = 0.2 + 0.8 * (i / (mouseTrail.length-1));
//             ctx.strokeStyle='rgba(255,255,255,' + opacityValue +')';
//             ctx.beginPath();
//             ctx.lineWidth = 0.5 +  2.5 * (i / (mouseTrail.length-1));
//             ctx.moveTo(Math.floor(point.x), Math.floor(point.y));
//             ctx.lineTo(Math.floor(connection.x), Math.floor(connection.y));
//             ctx.stroke();
            
//         }
//     }
// }







