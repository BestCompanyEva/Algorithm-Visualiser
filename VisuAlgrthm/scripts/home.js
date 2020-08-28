$(function() {

    //setNavPosition();

    // Create an element in the nav element for each headline with the class 'entry'
    for (const entry of $('.entry')) {
        let p = document.createElement('p');
        p.innerHTML = entry.innerHTML;
        document.querySelector('#navContents').appendChild(p);
        $(p).click(function(event){
            event.stopPropagation();
            jump(p);
        })
    }
});
// Determine whether the nav element should have an absolute or fixed position
// function setNavPosition(){
//     _top = parseFloat($('#canvas1').css('height')) + 50.0;
//     var elem = $('nav').first();
//     if(window.scrollY >= _top - 50 && elem.css('position') == 'absolute'){
//         elem.css('position','fixed');
//         elem.css('top','50px');
//     } else if (window.scrollY <= _top - 50 && elem.css('position') != 'absolute'){
//         elem.css({'position':'absolute', 'top': _top});
//     }
// }

// When clicking on a topic in the nav element, scroll to the clicked topic
function jump(node){
    for (const entry of $('.entry')) {
        if (entry.innerHTML == node.innerHTML){
            window.scrollTo(0, entry.getBoundingClientRect().top + window.scrollY);
        }
    }
}
$(window).scroll(function(){

    // setNavPosition();

})

$('#navBtn').click(function(event){
    event.stopPropagation()
    $('nav').first().toggleClass('navActive')
})
$(document).click(function(){
    $('nav').first().removeClass('navActive')
})
$('#switcher').click(function(){
    a = colours
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    let docStyle = getComputedStyle(document.documentElement);
    docStyle.setProperty('--primary_color', a[0]);
    docStyle.setProperty('--secondary_color', a[1]);
    docStyle.setProperty('--tertiary_color', a[2]);
    docStyle.setProperty('--quartery_color', a[3]);
    docStyle.setProperty('--quintery_color', a[4]);
})