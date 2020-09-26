$(function(){
    //Get algorithm
    var url = new URL(window.location.href);
    var alg = url.searchParams.get("a");
    var algo = algorithms[alg];
    //Load algorithm
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
//class for each algorithm type
class AlgorithmData{
    constructor(script, requiredElements, func){
        this.script = script;
        this.func = func;
        this.requiredElements = requiredElements;
    }
}
//Quicksort data
const qs = new AlgorithmData(
    `scripts\\quicksort.js`,
    [
        $('#amountSliderContainer'),
        $('#randomize')
    ],
    function(){
        var slider = $('#amountSlider');
        slider.attr({'min':'5', 'max':'100', 'value':'20'})
        document.getElementById('amountSliderValue').innerHTML = slider.attr('value');
    }
)
//Algorithm container
var algorithms = {
    'qs' : qs
}