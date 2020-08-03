const canvas = document.getElementById("vis-alg");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT

const barWidth = 0.6;
const textWidth = 0.8;
const offetTop = 100;
const offsetBot = 50;

$(function(){
    getElements()
    init();
})

function getElements(){
    var slider = $('#amountSlider');
    slider.attr({'min':'5', 'max':'100', 'value':'20'})
    document.getElementById('amountSliderValue').innerHTML = 20;
    $('#amountSliderContainer').removeClass('invisible');
}


function init(length = 20, array = undefined){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    arr = (array == undefined) ? Array.from({ length: length}, (_, idx) => Math.floor(Math.random() * 100 + 1)) : array;
    width = canvas.width / arr.length;
    one = (canvas.height - (offetTop + offsetBot)) / Math.max.apply(null, arr);
    textSize = (arr.length > 50) ? 0 : setTextSize();
    verticalTextPos =  10 + textSize;
    positions = new Array(arr.length);
    for (var i = 0; i < positions.length; i++){
        positions[i] = width * 0.5 + i * width;
    }
    drawBars();
    quicksort(arr, 0, arr.length - 1);
    console.log(arr);
}

function quicksort(array, lo, hi){
    if (lo < hi){
        var p = partition(array, lo, hi);
        quicksort(array, lo, p);
        quicksort(array, p + 1, hi);
    }
}
function partition(array, lo, hi){
    var pivot = array[Math.floor((hi + lo) / 2)];
    var i = lo - 1;
    var j = hi + 1;
    while(true){
        do {
            i++
        } while (array[i] < pivot);
        do {
            j--;
        } while (array[j] > pivot)
        if (i >= j){
            return j;
        }
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
}

function setTextSize(){
    //let max = Math.max.apply(null, arr);
    let max = 99;
    var _textWidth = width * textWidth;
    var minSize = 10;
    for (var i = 30; i > 0; i-=1){
        ctx.font = i.toString() + "px Arial";
        if (ctx.measureText(max).width <= _textWidth || i == minSize){
            console.log(ctx.measureText(max))
            return i;
        };
    }
}

function drawBars(){
    
    var halfBarWidth = (width * barWidth) / 2;
    console.log(positions)
    for (var i = 0; i < arr.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'purple';
        ctx.rect(positions[i] - halfBarWidth , canvas.height - (offsetBot + arr[i] * one), halfBarWidth * 2, one * arr[i]);
        ctx.fill();

        ctx.font = textSize + 'px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(arr[i], positions[i], canvas.height - offsetBot + verticalTextPos, width * textWidth)
    }
    
}

document.getElementById('amountSlider').oninput = function() {
    document.getElementById('amountSliderValue').innerHTML = this.value;
    init(length=this.value);
}