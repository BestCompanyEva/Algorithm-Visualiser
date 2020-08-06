$(function() {
    setAsidePosition();
    // Create an element in the aside element for each headline with the class 'entry'
    for (const entry of $('.entry')) {
        let p = document.createElement('p');
        p.innerHTML = entry.innerHTML;
        document.querySelector('aside').appendChild(p);
        $(p).click(function(){
            jump(p);
        })
    }
});
// Determine whether the aside object should have an absolute or fixed position
function setAsidePosition(){
    _top = parseFloat($('#canvas1').css('height')) + 50.0;
    var elem = $('aside').first();
    if(window.scrollY >= _top - 50 && elem.css('position') == 'absolute'){
        elem.css('position','fixed');
        elem.css('top','50px');
    } else if (window.scrollY <= _top - 50 && elem.css('position') != 'absolute'){
        elem.css({'position':'absolute', 'top': _top});
    }
}

// When clicking on a topic in the aside element, scroll to the clicked topic
function jump(node){
    for (const entry of $('.entry')) {
        if (entry.innerHTML == node.innerHTML){
            window.scrollTo(0, entry.getBoundingClientRect().top + window.scrollY);
        }
    }
}
$(window).scroll(function(){
    setAsidePosition();
})
