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

