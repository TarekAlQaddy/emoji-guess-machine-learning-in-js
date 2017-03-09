/**
 * Created by Tarek AlQaddy on 3/2/2017.
 */

introJs().start();

$("ul.tabs").tabs();

var canv = document.getElementById("canv"),
    canv2 = document.getElementById("canv2"),
    cx = canv.getContext("2d"),
    cx2 = canv2.getContext("2d"),
    emojisList = $("#emojis-list li"),
    btn = document.getElementById("submit-btn"),
    dTab = document.getElementById('draw'),
    predictImg = document.getElementById("predict-img"),
    paint = false,
    clickX = [],
    clickY = [],
    clickDrag = [],
    XYTemp = [],
    XYFinal = [],
    emojisFinal = [],
    emojisCount = [],
    selectedEmoji = null,
    minTrials = 4,
    classifier;

var emojis = [],emojisZeros = [];

cx.strokeStyle = "#000";
cx.lineJoin = "round";
cx.lineWidth = 7;
cx2.strokeStyle = "#000";
cx2.lineJoin = "round";
cx2.lineWidth = 7;

(function init() {
    for(var i=0; i < emojisList.length ;i++){
        var obj = {};
        obj.name = emojisList[i].id;
        obj.element = emojisList[i];
        obj.imgSrc = emojisList[i].children[0].src;

        emojis.push(obj);
        emojisZeros.push(0);
    }
    emojisCount = emojisZeros.slice();
    for(i=0;i<emojisList.length; i++){
        var ar = emojisZeros.slice();
        ar[i] = 1;
        emojis[i].array = ar;
    }

    emojis.forEach(function (v,n) {
        v.element.addEventListener('click',function () {
            XYTemp = [];
            for(var i =0;i<emojisList.length;i++)
                emojis[i].element.classList.add("disabled-emoji")
            this.classList.remove("disabled-emoji");

            selectedEmoji = n;

            if(emojisCount[selectedEmoji] <= minTrials)
                btnEnable(false);
            else
                btnEnable(true);

        })
    });
})();



function deselect() {
    emojis.forEach(function (v) {
        v.element.classList.remove("disabled-emoji");
    });
    selectedEmoji = null;
}


canv.addEventListener("mousedown",function (e) {
    paint = true;

    addClick(e.pageX - canv.offsetLeft, e.pageY - canv.offsetTop);
    draw(cx)
});

canv.addEventListener("mousemove",function (e) {
    if(paint){
        addClick(e.pageX - canv.offsetLeft, e.pageY - canv.offsetTop,true);
        draw(cx)
    }
});

canv.addEventListener("mouseup",function ()  {
    if(paint) {
        paint = false;
        cx.clearRect(0,0,cx.canvas.width,cx.canvas.height);
        sendDraw();
    }
});
canv.addEventListener("mouseleave",function () {
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

function draw(cx) {
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
        XYSet.push(Number((clickX[i]/cx.canvas.width).toFixed(2)));
        XYSet.push(Number((clickY[i]/cx.canvas.height).toFixed(2)));
    }
    clickX = [];
    clickY = [];

    if(XYSet.length !== 18) {
        message("Please be gentle",3,'red');
        return;
    }

    XYTemp.push(XYSet);

    if(++emojisCount[selectedEmoji] > minTrials)
        btnEnable(true);


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

        btnEnable(false);

        drawTabEnable(true);

        message("Success",3,"green");
    }
}

// Helper functions

function message(msg,sec,style) {
    Materialize.toast(msg,sec*1000,style);
}

function drawTabEnable(ex) {
    if(ex && dTab.classList.contains('disabled')){
        dTab.classList.remove('disabled')
    }
    else if(Object.is(ex,false) && !dTab.classList.contains('disabled'))
        dTab.classList.add('disabled');
}

function drawTabActive() {
    return !dTab.classList.contains('disabled');
}

function btnEnable(ex) {
    if(ex && btn.classList.contains('disabled'))
        btn.classList.remove('disabled');
    else if(Object.is(ex,false) && !btn.classList.contains('disabled'))
        btn.classList.add('disabled');
}

// Draw Part

function learnProcess(){
    if(drawTabActive()){
        console.log("active");
        classifier = new ml.LogisticRegression({
            'input': XYFinal,
            'label': emojisFinal,
            'n_in': 18,
            'n_out': emojisCount.length
        });

        classifier.set('log level,1');

        classifier.train({
            'lr': .06,
            'epochs': 10000
        });
    }


}

function predict(input) {
    return classifier.predict([input]);
}


canv2.addEventListener("mousedown",function (e) {
    paint = true;
    addClick(e.pageX - canv2.offsetLeft, e.pageY - canv2.offsetTop);
    draw(cx2)
});

canv2.addEventListener("mousemove",function (e) {
    if(paint){
        addClick(e.pageX - canv2.offsetLeft, e.pageY - canv2.offsetTop,true);
        draw(cx2)
    }
});

canv2.addEventListener("mouseup",function () {
    if(paint) {
        paint = false;
        cx2.clearRect(0,0,cx2.canvas.width,cx2.canvas.height);
        getPoints();
    }
});
canv2.addEventListener("mouseleave",function () {
    if(paint) {
        paint = false;
        cx2.clearRect(0,0,cx2.canvas.width,cx2.canvas.height);
        getPoints();
    }
});


function getPoints(){
    var n = Math.floor(clickX.length/8);

    var XYSet = [];

    for(var i=0;i<clickX.length;i+=n){
        XYSet.push(Number((clickX[i]/cx.canvas.width).toFixed(2)));
        XYSet.push(Number((clickY[i]/cx.canvas.height).toFixed(2)));
    }
    clickX = [];
    clickY = [];

    if(XYSet.length !== 18) {
        message("Please be gentle",3,'red');
        return;
    }
    try {
        var chosen = convertResults(predict(XYSet)[0]).indexOf(1);
    }
    catch (e){
        console.log(e);
    }

    emojiAppearAnimation(chosen);

}

function convertResults(ar) {
    for(var i=0;i<ar.length;i++){
        if(ar[i] > 0.65 )
            ar[i] = 1;
        else if(ar[i] < 0.4)
            ar[i] = 0;
        else{
            message('Not sure about it',3,"red");
            return;
        }
    }
    return ar;
}

function emojiAppearAnimation(chosen) {
    predictImg.src = emojis[chosen].imgSrc;
    predictImg.classList.add("start-anim");

    setTimeout(function () {
        predictImg.classList.remove("start-anim");
        predictImg.src = "";
    },1000)

}

function clearAll() {
    XYFinal = [];
    emojisFinal = [];
    emojisCount.forEach(function (v,i,ar) {
        ar[i] = 0;
    });
    drawTabEnable(false);
    deselect();
    message("Cleared",2,"green")
}