/**
 * Created by Tarek AlQaddy on 3/2/2017.
 */

// TODO: make the flow of the app
//

var canv = document.getElementById("canv"),
    cx = canv.getContext("2d"),
    emojisList = $("#emojis-list li"),
    paint = false,
    clickX = [],
    clickY = [],
    clickDrag = [],
    XYLearn = [],
    emojiCount = [],
    selectedEmoji = null;

var emojis = [],emojisData = [];

function init() {
    for(var i=0; i < emojisList.length ;i++){
        var obj = {};
        obj.name = emojisList[i].id;
        obj.element = emojisList[i];

        emojis.push(obj);
        emojisData.push(0)
    }
}

init();

cx.strokeStyle = "#000";
cx.lineJoin = "round";
cx.lineWidth = 7;

$("ul.tabs").tabs();

emojisList.click(function () {

    for(var i=0;i<emojisList.length;i++) {
        emojisList[i].classList.add('disabled-emoji');
    }
    $(this).removeClass("disabled-emoji");

    //TODO set selected emoji to this element

});


canv.addEventListener("mousedown",function (e) {
    paint = true;

    addClick(e.pageX - canv.offsetLeft, e.pageY - canv.offsetTop);
    draw()
});

canv.addEventListener("mousemove",function (e) {
    if(paint){
        addClick(e.pageX - canv.offsetLeft, e.pageY - canv.offsetTop,true);
        draw()
    }
});

canv.addEventListener("mouseup",function (e) {
    if(paint) {
        paint = false;
        sendDraw();
    }
});
canv.addEventListener("mouseleave",function (e) {
    if(paint) {
        paint = false;
        sendDraw();
    }
});

function addClick(x,y,dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function draw() {
    cx.clearRect(0,0,cx.canvas.width,cx.canvas.height);
    for(var i=0;i<clickX.length;i++){

        cx.beginPath();
        if(clickDrag[i] && i)
            cx.moveTo(clickX[i-1], clickY[i-1]);
        else
            cx.moveTo(clickX[i]-1, clickY[i]);

        cx.lineTo(clickX[i], clickY[i]);
        cx.closePath();
        cx.stroke();
    }
}

function sendDraw() {
    var n = Math.floor(clickX.length/8);

    var XYSet = [];

    for(var i=0;i<clickX.length;i+=n){//TODO: make it a ratio 0=>1
        XYSet.push(clickX[i]);
        XYSet.push(clickY[i]);
    }

    console.log(XYSet.length);

    if(XYSet.length !== 18){}
        //TODO error

    XYLearn.push(XYSet);
}
