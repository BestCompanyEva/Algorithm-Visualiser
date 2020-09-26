const canvas = document.getElementById("vis-alg");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT
const descr = document.getElementById('description');

canvas.width = 1800;
canvas.height = 1000;

var delay = 1000;
var speed = 0.3;

var cwidth = 900;
var cheight = 500;
canvas.style.width = "900px";
canvas.style.height = "500px";

canvas.getContext('2d').scale(2,2);

const barWidth = 0.6;
const textWidth = 1.1;
const offetTop = 100;
const offsetBot = 50;
const offsetLeft = 50;

dragging = false;


$(function(){
    arr = [];
    init();
})

class Bar{
    constructor(value){
        this.value = value;
        this.height = 0;
        this.width = 0;
        this.positionX = 0;
        this.positionY = cheight - offsetBot;
        this.color = 'purple';
        this.stable = false;
        this
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = (this.stable && this.color != "blue") ? "grey" : this.color;
        ctx.rect(Math.round(this.positionX - this.width / 2) , Math.round(this.positionY - this.height), Math.round(this.width), Math.round(this.height));
        ctx.fill();
    }
    drawText(){
        ctx.font = textSize + 'px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        let _100Mult = (this.value == 100) ? 1.5 : 1;
        ctx.fillText(this.value, this.positionX, this.positionY + verticalTextPos/*, this.width * textWidth * _100Mult*/);
    }
    draggable(x,y){
        let range = 5;
        if(between(x, this.positionX - this.width / 2, this.positionX + this.width / 2) && between(y, this.positionY - this.height - range, this.positionY - this.height + range)){
            return true;
        }
        return false;
    }
    drag(y){
        let value = Math.round((this.positionY - y) / one)
        value = Math.clip(value, 1, 100);
        if (value != this.value){
            this.changeValue(value);
        }
    }
    changeValue(value){
        let realWidth = this.width / barWidth;
        //ctx.clearRect(this.positionX - realWidth / 2, 0, realWidth, cheight);
        this.value = value;
        this.height = one * this.value;
        drawEverything();
    }
    pivot(){
        for (const box of arr) {
            if(box.color == "blue"){
                box.color = "purple"
            }
        }
        this.color = "blue";
        drawEverything();
    }
    comparing1(){
        for (const box of arr) {
            if(box.color == "red"){
                box.color = "purple"
            }
        }
        this.color = "red";
        drawEverything();
    }
    comparing2(){
        for (const box of arr) {
            if(box.color == "green"){
                box.color = "purple"
            }
        }
        this.color = "green";
        drawEverything();
    }
}

Math.clip = function(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

function between(x, min, max) {
    return x >= min && x <= max;
  }

function init(length=$('#amountSliderValue').html()|20,array=undefined,random=false){
    if (random == true){
        arr = randomArr(length);
    } else {
        while(arr.length != length){
            if(arr.length > length){
                arr.pop();
            } else {
                arr.push(new Bar(20));
            }
        }
    }
    setData();
    drawEverything();
}

function drawEverything(){
    ctx.clearRect(0,0,cwidth,cheight);
    drawAxis(maxValue, one);
    drawBars();
}

function randomArr(length){
    return Array.from({ length: length}, (_, idx) => new Bar(Math.floor(Math.random() * 100 + 1)));
    
}

function setData(){
    width = (cwidth - offsetLeft) / arr.length;
    maxValue = 100 //Math.max.apply(null, arr.map(x => x.value);
    one = (cheight - (offetTop + offsetBot)) / maxValue;
    textSize = (arr.length > 20) ? 0 : 25;//setTextSize();
    verticalTextPos =  10 + textSize;
    for (var i = 0; i < arr.length; i++){
        arr[i].positionX = offsetLeft + width * 0.5 + i * width;
        arr[i].height = one * arr[i].value;
        arr[i].width = width * barWidth;
    };
}

function drawAxis(max, one){
    let axisWidth = 20;
    let divisor = 4;
    let divPos = [0];
    for (let index = 1; index < divisor + 1; index++){
        divPos.push(Math.round(max * index / divisor));
    }
    
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    let left = (offsetLeft-axisWidth) / 5 * 4;
    let middle = left + axisWidth / 2;
    let right = left + axisWidth;
    let height = cheight - offsetBot;
    ctx.moveTo(middle + 0.5, height +10 + 0.5);
    height = cheight - (offsetBot + max * one);
    ctx.lineTo(middle + 0.5, height - 10 + 0.5);

    ctx.font = 12 + 'px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'grey';

    for (const p of divPos) {
        height = cheight - (offsetBot + one * p);
        let adds = {
            0:0.5,
            25:0.0,
            50:-0.5,
            75:0.5,
            100:0
        }
        let add = adds[p];
        ctx.moveTo(left + add, height + add);
        ctx.lineTo(cwidth - 3 + add, height + add);
        ctx.fillText(p, left/2 - 1, height + 4.5);
    }
    ctx.stroke();

}

async function quicksort(array, lo, hi){
    if (lo < hi){
        var p = await partition(array, lo, hi);
        console.log(p)
        await quicksort(array, lo, p - 1);
        await quicksort(array, p + 1, hi);
    }
    array[lo].stable = true;
    drawEverything();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function partition(array, lo, hi){
    var pivotBox = array[hi];
    pivotBox.stable = true;
    pivotBox.pivot();
    descr.innerHTML =  pivotBox.value + " is the pivot"
    var pivot = pivotBox.value;
    await sleep(delay);
    var i = lo;
    var j = lo;
    while(true){
        array[j].comparing2();
        array[j].comparing1();
        descr.innerHTML =  `Comparing ${array[j].value} and ${pivot}`
        await sleep(delay);
        while (array[j].value < pivot){
            descr.innerHTML =  `${array[j].value} is smaller than ${pivot}.`
            await sleep(delay);
            j++;
            array[j].comparing1();
            descr.innerHTML =  `Incrementing j and comparing ${array[j].value} with ${pivot}.`;
            await sleep(delay);
        }
        if (j >= hi){
            descr.innerHTML =  `Reached the end`;
            await sleep(delay);
            return j;
        }
        descr.innerHTML =  `${array[j].value} is greater than ${pivot}.`
        await sleep(delay);
        i = (i<=j) ? j+1 : i;
        descr.innerHTML =  `Comparing ${array[i].value} and ${pivot}`;
        array[i].comparing2();
        await sleep(delay)
        while (array[i].value > pivot){
            descr.innerHTML =  `${array[i].value} is greater than ${pivot}.`
            await sleep(delay);
            i++;
            array[i].comparing2();
            descr.innerHTML =  `Incrementing i and comparing ${array[i].value} with ${pivot}.`;
            await sleep(delay);
        }
        if (i >= hi){
            let x = array[hi];
            array[hi] = array[j];
            array[j] = x;
            descr.innerHTML =  `Reached the end, swaping pivot and ${array[j].value}`;
            setData();
            drawEverything();
            await sleep(delay)
            return j;
        }
        descr.innerHTML =  `${array[i].value} is smaller or equal ${pivot}.`
        await sleep(delay);
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
        setData();
        drawEverything();
        descr.innerHTML =  `Swapping ${array[i].value} and ${array[j].value}.`
        j+=1;
        if (i==j){
            i = j + 1;
        }
        await sleep(delay);
        
    }
}

function setTextSize(){
    let max = Math.max.apply(null, arr.map(x => x.value));
    function isLogOf10(x){
        let log = (Math.log(x) / Math.log(10)).toFixed(7);
        return parseFloat(log) == parseInt(log);    
    }
    max = (isLogOf10(max)) ? max-1 : max;
    var _textWidth = width * textWidth;
    var minSize = 10;
    for (var i = 30; i > 0; i-=1){
        ctx.font = i.toString() + "px Arial";
        if(i == minSize){
            return 0;
        }
        if (ctx.measureText(max).width <= _textWidth){
            return i;
        };
    }
}

function drawBars(){
    
    var halfBarWidth = (width * barWidth) / 2;
    for (const bar of arr) {

        bar.draw();
        if (textSize > 0){
            bar.drawText();
        }
    }

}

function mouseOnBarCheck(textInclusive=false){

    let text = (textInclusive) ? 40 : 0;
    var rect = document.getElementById('vis-alg').getBoundingClientRect();
    for (const bar of arr) {
        let x = bar.positionX - bar.width / 2 + rect.left + window.scrollX;
        let y = bar.positionY - bar.height + rect.top + window.scrollY;
        if (mouse.x > x && mouse.x < x + bar.width && mouse.y > y && mouse.y < y + bar.height + text){
            return bar;
        }
    }
    return false;
}



$('#vis-alg').mouseenter(function(){
    $('#showValue').removeClass('invisible');
});

$(document).mousemove(descriptionHandler);

var hasDisappeared = true
function descriptionHandler(){
    valueHandler()
    let rect = mouseOnBarCheck().value;
    if (rect && hasDisappeared){
        $('#showValue').html(rect);
        $('#showValue').css({'opacity':'1'});
        $('#showValue').css('transition-delay', '0.5s');

    } else {
        if (hasDisappeared){
            hasDisappeared = false;
            setTimeout(function(){
                hasDisappeared = true;
                descriptionHandler();
            }, 100)
        }
        $('#showValue').css('opacity','0');
        $('#showValue').css('transition-delay', '0s');

    }
}

function valueHandler(){
    let rect = document.getElementById('vis-alg').getBoundingClientRect();
    let xMod = rect.left + window.scrollX;
    let yMod = rect.top + window.scrollY;
    if (dragging){
        draggableObj.drag(mouse.y-yMod);
    } else{
        if (arr){
            for (const box of arr) {
                if (box.draggable(mouse.x - xMod, mouse.y - yMod)){
                    canvas.style.cursor = 'row-resize';
                    draggableObj = box;
                    break;
                } else {
                    canvas.style.cursor = 'default';
                    draggableObj = false;
                }
            }
        }
    }

}

$('#vis-alg').mouseleave(function(){
    $('#showValue').css('opacity','0');
    $('#showValue').addClass('invisible');
})

$('#vis-alg').mousedown(function(){
    if (draggableObj){
        dragging = true;
    }
})
$(document).mouseup(function(){
    if (dragging){
        dragging = false;
    }
})

document.getElementById('amountSlider').oninput = function() {
    document.getElementById('amountSliderValue').innerHTML = this.value;
    init(this.value);
}

document.getElementById('tempoSlider').oninput = function() {
    document.getElementById('tempoSliderValue').innerHTML = this.value;
    delay = 1000 / this.value;
}
$('#randomize').click(function(){
    init(parseInt($('#amountSliderValue').html()),undefined,true);
})
$('#sort').click(function(){
    quicksort(arr, 0, arr.length - 1);
    init(length=arr.length, undefined, false);
})