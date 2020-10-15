//default var 
colours = [
    "#91e5f6ff", //light blue
    "#f6e898",   //yellow
    "#315272ff", //darker blue
    "#377dabff", //ligther blue
    "#3ba9dcff"
];
var re = /#[a-zA-Z0-9_]{6,8}/g
const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (e) => {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      var res = contents.match(re);
      colours = [
          res[0],
          res[1],
          res[2],
          res[3],
          res[4]
      ]
      start()
      setColors()
    };
    reader.readAsText(file);

});

function setColors(){
    var textContainers = [
        "SPAN",
        "P",
        "H1",
        "H2"
    ]
    var colourClasses = [
        "colour_1",
        "colour_2",
        "colour_3",
        "colour_4",
        "colour_5"
    ]
    for (let index = 0; index < 5; index++) {

        $('.' + colourClasses[index]).each(function() {
            if($(this).prop('tagName') == 'CANVAS'){
                $(this).css("background", "radial-gradient(" + colours[index] + ", #000000");
            } else if (textContainers.includes($(this).prop('tagName'))){
                $(this).css("color", colours[index]);
            } else if ($(this).hasClass('article')){
                $(this).css('border-top', '1px solid ' + colours[index]);
            } else if ($(this).hasClass('algo-container')){
                $(this).css('border', '1.15px solid ' + colours[index]);
            } else {
                $(this).css("background", colours[index]);
                if ($(this).attr('id') == 'navBtn'){
                    $(this).hover(function(){
                        $(this).css('background-color', colours[4]);
                    }, function(){
                        $(this).css('background-color', colours[index]);
                    })
                    $(this).css('background-color', colours[index])
                } else if ($(this).attr('id') == 'navContents'){
                    var x = $(this).children()
                    console.log(x)
                    for (const obj of x) {
                        $(obj).hover(function(){
                            $(obj).css('background-color', colours[4]);
                        }, function(){
                            $(obj).css('background-color', colours[index]);
                        })
                        $(obj).css('background-color', colours[index])
                    }
                }
            }

        });
        
    }
}

$('#switcher').click(function(){
    a = colours
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    start();
    setColors();
})