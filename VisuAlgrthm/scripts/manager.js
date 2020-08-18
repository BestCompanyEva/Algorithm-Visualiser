$(function(){
    var url = new URL(window.location.href);
    var alg = url.searchParams.get("a");
    var algo = algorithms[alg];
    if(algo != undefined){
        for (const ele of algo.requiredElements) {
            ele.removeClass('invisible');
        };
        algo.func();
        var script = document.createElement('script')
        script.src = algo.script;
        document.head.appendChild(script); 
    }
});
class AlgorithmData{
    constructor(script, requiredElements, func){
        this.script = script;
        this.func = func;
        this.requiredElements = requiredElements;
    }
}
const qs = new AlgorithmData(
    `scripts\\quicksort.js`,
    [
        $('#amountSliderContainer'),
        $('#randomize')
    ],
    function(){
        var slider = $('#amountSlider');
        slider.attr({'min':'5', 'max':'100', 'value':'50'})
        document.getElementById('amountSliderValue').innerHTML = slider.attr('value');
    }
)
var algorithms = {
    'qs' : qs
}