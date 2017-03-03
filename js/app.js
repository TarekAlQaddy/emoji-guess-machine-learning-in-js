/**
 * Created by Tarek AlQaddy on 3/2/2017.
 */
$("ul.tabs").tabs();

var canv = document.getElementById("canv"),
    cx = canv.getContext("2d"),
    emojisList = $("#emojis-list li"),
    btn = document.getElementById("submit-btn"),
    paint = false,
    clickX = [],
    clickY = [],
    clickDrag = [],
    XYTemp = [],
    XYFinal = [],
    emojisFinal = [],
    emojisCount = [],
    selectedEmoji = null,
    minTrials = 5;

var emojis = [],emojisZeros = [];

cx.strokeStyle = "#000";
cx.lineJoin = "round";
cx.lineWidth = 7;

function init() {
    for(var i=0; i < emojisList.length ;i++){
        var obj = {};
        obj.name = emojisList[i].id;
        obj.element = emojisList[i];

        emojis.push(obj);
        emojisZeros.push(0);
    }
    emojisCount = emojisZeros.slice();
    for(i=0;i<emojisList.length; i++){
        var ar = emojisZeros.slice();
        ar[i] = 1;
        emojis[i].array = ar;
    }
}

init();



emojis.forEach(function (v,n) {
    v.element.addEventListener('click',function () {
        XYTemp = [];
        for(var i =0;i<emojisList.length;i++)
            emojis[i].element.classList.add("disabled-emoji")
        this.classList.remove("disabled-emoji");

        selectedEmoji = n;

        if(emojisCount[selectedEmoji] <= minTrials)
            btn.classList.add("disabled");
        else if(btn.classList.contains("disabled"))
            btn.classList.remove("disabled")

    })
});




function deselect() {
    emojis.forEach(function (v) {
        console.log(v);
        v.element.classList.remove("disabled-emoji");
    });
    selectedEmoji = null;
}


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
        cx.clearRect(0,0,cx.canvas.width,cx.canvas.height);
        sendDraw();
    }
});
canv.addEventListener("mouseleave",function (e) {
    if(paint) {
        paint = false;
        cx.clearRect(0,0,cx.canvas.width,cx.canvas.height);
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

    for(var i=0;i<clickX.length;i+=n){
        XYSet.push((clickX[i]/cx.canvas.width).toFixed(2));
        XYSet.push((clickY[i]/cx.canvas.height).toFixed(2));
    }

    if(XYSet.length !== 18) {
        return;
    }

    XYTemp.push(XYSet);

    if(++emojisCount[selectedEmoji] > 5 && btn.classList.contains("disabled")){
        btn.classList.remove("disabled")
    }
}

function submitEmoji(){


    if(selectedEmoji || Object.is(selectedEmoji,0)) {
        XYTemp.forEach(function (v) {
            XYFinal.push(v);
        });

        for (var i = 0; i < XYTemp.length; i++) {
            emojisFinal.push(emojis[selectedEmoji].array.slice());
        }

        XYTemp = [];

        deselect();

        btn.classList.add("disabled");

        message("Success",3,"green");
    }
}


function message(msg,sec,style) {
    Materialize.toast(msg,sec*1000,style);
}


