
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

