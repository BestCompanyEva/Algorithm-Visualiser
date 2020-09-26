const canvas = document.getElementById("vis-alg");
const ctx = canvas.getContext("2d"); // CTX MEANS CONTEXT


const barWidth = 0.6;
const textWidth = 1.1;
const offetTop = 100;
const offsetBot = 50;
const offsetLeft = 50

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
        this.positionY = canvas.height - offsetBot;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = 'purple';
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
        //ctx.clearRect(this.positionX - realWidth / 2, 0, realWidth, canvas.height);
        this.value = value;
        this.height = one * this.value;
        ctx.clearRect(0,0,canvas.width,canvas.height);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
    drawAxis(maxValue, one);
    drawBars();
}

function randomArr(length){
    return Array.from({ length: length}, (_, idx) => new Bar(Math.floor(Math.random() * 100 + 1)));
    
}

function setData(){
    width = (canvas.width - offsetLeft) / arr.length;
    maxValue = 100 //Math.max.apply(null, arr.map(x => x.value);
    one = (canvas.height - (offetTop + offsetBot)) / maxValue;
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
    let height = canvas.height - offsetBot;
    ctx.moveTo(middle + 0.5, height + 0.5);
    height = canvas.height - (offsetBot + max * one);
    ctx.lineTo(middle + 0.5, height - 10 + 0.5);

    ctx.font = 12 + 'px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'grey';

    for (const p of divPos) {
        height = canvas.height - (offsetBot + one * p);
        let add = (p % 2 == 0) ? 0.5 : 0
        ctx.moveTo(left + add, height + add);
        ctx.lineTo(canvas.width - 3 + add, height + add);
        ctx.fillText(p, left/2 + 0.5, height + 4 + 0.5);
    }
    ctx.stroke();

}

function quicksort(array, lo, hi){
    if (lo < hi){
        var p = partition(array, lo, hi);
        quicksort(array, lo, p);
        quicksort(array, p + 1, hi);
    }
}
function partition(array, lo, hi){
    var pivot = array[Math.floor((hi + lo) / 2)].value;
    var i = lo - 1;
    var j = hi + 1;
    while(true){
        do {
            i++
        } while (array[i].value < pivot);
        do {
            j--;
        } while (array[j].value > pivot)
        if (i >= j){
            return j;
        }
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
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
$('#randomize').click(function(){
    init(parseInt($('#amountSliderValue').html()),undefined,true);
})
$('#sort').click(function(){
    quicksort(arr, 0, arr.length - 1);
    init(length=arr.length, undefined, false);
})