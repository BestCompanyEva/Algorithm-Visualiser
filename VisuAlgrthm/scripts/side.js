$(function(){
    var url = new URL(window.location.href);
    var alg = url.searchParams.get("a");
    if(algorithms[alg] != undefined){
        var script = document.createElement('script')
        script.src = algorithms[alg];
        document.head.appendChild(script); 
    }
});
var algorithms = {
    'qs' : `scripts\\quicksort.js`
}
let mouse = {
	x: null,
	y: null
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x;
        mouse.y = event.y + window.scrollY;
        $('#showValue').css({'top':mouse.y + 2 + 'px', 'left': mouse.x + 13 + 'px'});
});

