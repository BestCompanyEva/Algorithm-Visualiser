
let mouse = {
	x: null,
	y: null
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + window.scrollX;
        mouse.y = event.y + window.scrollY;

        $('#showValue').css({'top':mouse.y + 2 + 'px', 'left': mouse.x + 13 + 'px'});

});
function convertValue(value){
    // if (value > 5000){
    //     value = Math.round((2**(value/5000)-1)**(Math.log(100)/Math.log(3)));
    // } else if (value < 4700){
    //     value = Math.round(100*((39/20)**(value/4700)-0.95))/100;
    // } else {
    //     value = 1;
    // }
	// return value;

	// let a = (1999)/(5000000000000);
	// let b = (-1009)/(250000000);
	// let c = (83)/(8000);
	let a = (19)/(2500000000000);
	let b = (-57)/(500000000);
	let c = (57) / (100000);
	value = a * (value ** 3) + b * (value ** 2) + c * value + 0.05;
	if(value > 10){
		value = Math.round(value);
	} else if (value > 0.997){
		value = Math.round(value*10)/10;
	} else {
		value = Math.round(value*100)/100;
	}
	console.log(a,b,c)
	return value;
}

