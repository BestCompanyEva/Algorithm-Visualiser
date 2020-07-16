$(function() {

});

const targetScale = 1.15;
var increment = calcInc(); //The more Particles, the biger the increment
var IDs = {};
var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;

//Small zoom when hovering above the photos
$('.algo-container').mouseenter(function(){
    //Get target element
    var ele = $(this).find('.algo-image-container').first()
    //Get the index of the element
    var index = Array.from(document.querySelectorAll('.algo-container')).indexOf(this);
    //Get its current scale
    var scale = parseFloat(ele.css('transform').match(matrixRegex)[1])
    //Stop previous animations
    clearInterval(IDs[index])
    //Start animation
    IDs[index] = setInterval(frame, 5);
    function frame() {
        if (scale >= targetScale) {
            clearInterval(IDs[index]);
        } else {
            scale += 0.0025 * increment;
            ele.css('transform', 'scale(' + ease(scale) + ')')
        };
    }
    
})
//Return photos to normal size
$('.algo-container').mouseleave(function(){
    //Get target element
    var ele = $(this).find('.algo-image-container').first()
    //Get the index of the element
    var index = Array.from(document.querySelectorAll('.algo-container')).indexOf(this);
    //Get its current scale
    var scale = parseFloat(ele.css('transform').match(matrixRegex)[1])
    //Stop previous animations
    clearInterval(IDs[index])
    //Start animation
    IDs[index] = setInterval(frame, 5);
    function frame() {
        if (scale <= 1) {
            clearInterval(IDs[index]);
        } else {
            scale -= 0.0025 * increment;
            ele.css('transform', 'scale(' + ease(scale) + ')')
        };
    }
    
    
})

//Custom ease function
function ease(x){
    res = (Math.sin(((20) / (3) * x - 1.16) * Math.PI) + 14.335) / (2) * 0.15;
    return res;
}
//Set speed of zoom animation depending on the number of particles on screen
function calcInc(){
    return Math.pow(numOfParticles / 120, 2);
}

$(window).resize(function(){
    increment = calcInc();
})