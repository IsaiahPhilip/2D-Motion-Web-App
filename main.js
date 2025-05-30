// arrow boolean variables
let vCheck, vXCheck, vYCheck;

// graph boolean variables
let pXGCheck, pYGCheck, vXGCheck, vYGCheck;

//Instantiating the canvases
var context = document.getElementById("Animation").getContext("2d");
var ctx2 = document.getElementById("Values").getContext("2d");
var ctx3 = document.getElementById("Graph").getContext("2d");
var ctx4 = document.getElementById("Line").getContext("2d");

// bases for canvas 2(values canvas)
var yBase2 = 40;
var xBase2 = 40;

// The values produced by the simulation are divided by a factor of 4 before they are presented to the student
// scaling factor is used for position variables
var scalingFactor = 4;

// index variable is the count of each frame/step/iteration of drawMotion() that has passed in the animation, before the animation it is set to -1.
var index = -1;

// base values for canvas 1(animation canvas)
var xBase = 10;
var yBase = 10;

var radius = 6; //ball

//values for arrow
var mx = 240;
var arrowy = yBase;
var arrowx = xBase;

//sets inital x/y values for animation
var x1Init = 0;
var x1 = xBase;
var v1x = 0.0;
var vX = 0;
var ax = 0.0;
var y1Init = 0;
var y1 = yBase;
var v1y = 0.0;
var vY = 0;
var ay = 0.0;

//time counted in seconds, is determined by index
var time = 0.0;
var timer;

//sentinel value to run/not run program
var runFlag = 1;

// Value of x1 without the base, this is the true value that will be used for the displayValues and the graph
var xPos = x1 - xBase;
var yPos = y1 - yBase;

//graph variables
var axisLabel, axisValue, xGraph, yGraph;
let maxValue, minValue;

// x/y-axis label for canvas 3 graph
let xLabel = 'Time';
let yLabel, yColor;

// moves pen on line canvas to the origin.
ctx4.beginPath();
ctx4.moveTo(xBase + 35, yBase + 25);

// initiates program
drawMotion();

var completeDisplay = false;

/**
*  Draws (given parameter/time) graph
*  Each parameter correlates to a different graph. 
*  Ex: posX -> positionX/time graph
*  No more than one parameter should be true at any given time.
*  This function also draws the graph line.
*/
function drawGrid(posX, posY, velX, velY) {
    let totalTime; // will be set equal to the lowest total time
    let totalTimeX = 50; // will be the time an X boundary is reached.
    let totalTimeY = 50; // will be the time a y boundary is reached.
    //cX and cY are initial x/y - final x/y assuming final x/y will be the max boundary(470 pre scaling).
    let cX = x1Init - 470;
    let cY = y1Init - 350;

    //cX2 and cY2 are initial x/y - final x/y assuming final x/y will be the min boundary(-10 pre scaling).
    let cX2 = (x1Init + xBase);
    let cY2 = (y1Init + yBase);

    // methods for finding max time when acceleration is zero
    // uses kinematic equation 3 when acceleration is 0: X = Xo + (Vo)t, solve for t, t = (X-Xo)/Vo
    if (ax == 0 && ay == 0) {
        if (v1x >= 0) {
            totalTimeX = (-1 * (cX / v1x)) / scalingFactor;
        }
        if (v1y >= 0) {
            totalTimeY = (-(cY / v1y)) / scalingFactor;
        }
        if (v1x < 0) {
            totalTimeX = (-1 * (cX2 / v1x)) / scalingFactor;
        }
        if (v1y < 0) {
            totalTimeY = (-1 * (cY2 / v1y)) / scalingFactor;
        }
    }

    // Acceleration methods use kinematic equation 3: X = (1/2)(Ax)(t^2) + (Vox)(t) + Xo
    //                                                0 = (1/2)(Ax)(t^2) + (Vox)(t) + (Xo - X)
    //                                                quadratic equation is used to determine the values of t(time)
    //Method for finding totalTimeX when X acceleration is greater than zero
    if (ax > 0) {
        let rootPart = Math.sqrt((v1x * v1x) - (2 * ax * ((cX) / scalingFactor)));
        let root1 = ((-v1x + rootPart) / (ax));
        let root2 = ((-v1x - rootPart) / (ax));

        //console.log("rootPart: " + rootPart + ", root1: " + root1 + ", root2: " + root2);
        totalTimeX = root1;

    }

    //Method for finding totalTimeX when X acceleration is less than zero
    if (ax < 0) {
        let rootPart = Math.sqrt((v1x * v1x) - (2 * ax * ((cX2) / scalingFactor)));
        let root1 = ((-v1x + rootPart) / (ax));
        let root2 = ((-v1x - rootPart) / (ax));

        //console.log("rootPart: " + rootPart + ", root1: " + root1 + ", root2: " + root2);
        totalTimeX = root2;
    }

    //Method for finding totalTimeY when Y acceleration is greater than zero
    if (ay > 0) {
        let rootPart = Math.sqrt((v1y * v1y) - (2 * ay * ((cY) / scalingFactor)));
        let root1 = ((-v1y + rootPart) / (ay));
        let root2 = ((-v1y - rootPart) / (ay));

        //console.log("rootPart: " + rootPart + ", root1: " + root1 + ", root2: " + root2);
        totalTimeY = root1;

    }

    //Method for finding totalTimeY when Y acceleration is less than zero
    if (ay < 0) {
        let rootPart = Math.sqrt((v1y * v1y) - (2 * ay * ((cY2) / scalingFactor)));
        let root1 = ((-v1y + rootPart) / (ay));
        let root2 = ((-v1y - rootPart) / (ay));

        //console.log("rootPart: " + rootPart + ", root1: " + root1 + ", root2: " + root2);
        totalTimeY = root2;

    }

    //checking which total time is smaller and taking the smallest
    if (totalTimeX <= totalTimeY) {
        totalTime = totalTimeX;
    } else {
        totalTime = totalTimeY;
    }

    //maxValue is determined by kinematic equation 3
    //We are finding X in this scenario, so it is straight forward plugging in and calculating.
    //(Number(v1x)*totalTime) + (.5*ax*totalTime*totalTime) + x1Init/scalingFactor
    if (posX) {
        maxValue = 115;
        minValue = -2.5;
        /*
        if(ax<0){
        let tXMax = Number(-v1x)/ax;
        maxValue =  x1Init/scalingFactor + (Number(v1x)*tXMax) + (.5*ax*tXMax*tXMax);
        }
        */
        ctx4.lineTo(((385 / totalTime) * time) + 45, (((maxValue - minValue) / 225) * x1) + 35);
        ctx4.stroke();
        yLabel = 'X-Position';
        yColor = "#FFA500";
    }
    if (posY) {
        maxValue = 85;
        minValue = -2.5;
        /*
        if(ay<0){
        let tYMax = Number(-v1y)/ay;
        maxValue =  y1Init/scalingFactor + (Number(v1y)*tYMax) + (.5*ay*tYMax*tYMax);
        }
        */
        ctx4.lineTo(((385 / totalTime) * time) + 45, (((maxValue - minValue) / 125) * y1) + 35);
        ctx4.stroke();
        yLabel = 'Y-Position';
        yColor = "#800080";
    }
    let yGraphBase = 35;
    if (velX) {
        maxValue = (Number(v1x) + (ax * totalTime));
        minValue = 0;
        if (ax < 0) {
            minValue = (Number(v1x) + (ax * totalTime)); //final velocity
            maxValue = (Number(v1x)); //initial velocity
            yGraphBase = 285;
            ctx4.lineTo(((385 / totalTime) * time) + 45, (((250) / (maxValue - minValue)) * (vX - v1x)) + 285);
        }
        if (ax > 0 && v1x > 0) {
            ctx4.lineTo(((385 / totalTime) * time) + 45, ((250 / (maxValue - minValue)) * vX) + 35);
        }
        ctx4.stroke();
        yLabel = 'X-Velocity';
        yColor = "#FF0000";
    }
    if (velY) {
        maxValue = (Number(v1y) + (ay * totalTime));
        minValue = 0;
        if (ay < 0) {
            minValue = (Number(v1y) + (ay * totalTime));
            maxValue = (Number(v1y));
            yGraphBase = 285;
            ctx4.lineTo(((385 / totalTime) * time) + 45, ((250 / (maxValue - minValue)) * (vY - v1y)) + 285);
        }
        if (ay > 0 && v1y > 0) {
            ctx4.lineTo(((385 / totalTime) * time) + 45, ((250 / (maxValue - minValue)) * vY) + 35);
        }
        ctx4.stroke();
        yLabel = 'Y-Velocity';
        yColor = "#00FF00";
    }

    ctx3.clearRect(0, 0, 480, 360);
    ctx3.beginPath();
    console.log("maxValue: " + maxValue + ", v1x: " + v1x + ", ax: " + ax);

    // 13 vertical grid lines
    for (var i = 0; i <= 11; i++) {
        xGraph = (xBase + 35) + (35 * i);
        ctx3.moveTo(xGraph, (yBase + 25));
        ctx3.lineTo(xGraph, 360);
        ctx3.stroke();
        ctx3.font = '14pt Calibri';
        ctx3.fillStyle = 'black';
        ctx3.textAlign = 'center';
        ctx3.textBaseline = 'middle';
        axisValue = i * (totalTime / 11);
        axisLabel = axisValue.toFixed(1);
        //Place Labels
        ctx3.save();
        ctx3.translate(0, 30);
        ctx3.rotate(-Math.PI);

        ctx3.scale(-1, 1);
        ctx3.fillText(axisLabel, xGraph, yBase);
        ctx3.restore();
    }

    console.log("totalTime: " + totalTime);

    // 11 Horizontal Grid Lines
    for (var i = 0; i <= 10; i++) {
        yGraph = (yBase + 25) + (25 * i);
        ctx3.moveTo(xBase + 25, yGraph);
        ctx3.lineTo(480, yGraph);
        ctx3.stroke();
        ctx3.font = '14pt Calibri';
        ctx3.fillStyle = 'black';
        ctx3.textAlign = 'center';
        ctx3.textBaseline = 'middle';
        //maxValue-minValue is the range/difference.
        axisValue = (((-i + 10) * (maxValue - minValue)) / 10) + minValue;
        axisLabel = axisValue.toFixed(1);
        // Place Labels
        // multiple transformations needed to be used in order to get the labels oriented correctly
        ctx3.save();
        ctx3.translate(10, 320);
        ctx3.rotate(-Math.PI);
        ctx3.scale(-1, 1);
        ctx3.fillText(axisLabel, xBase, yGraph);
        ctx3.fillStyle = yColor;
        ctx3.fillText(yLabel, 30, 10);
        ctx3.fillStyle = 'black';
        ctx3.fillText(xLabel, 445, 275);
        ctx3.restore();
    }
}


function drawMotion() {

    if ((x1 >= (480)) || (y1 >= 360) || (y1 <= 0) || (x1 <= 0) || (time >= 50)) {
        runFlag = 0;
        completeDisplay = true;
    }


    console.log("In the drawMotion function, with runFlag = " + runFlag + " Index: " + index + " x1init = " + x1Init + " x1 = " + x1 + " time = " + time + " y1Init =" + y1Init + " y1 = " + y1);
    console.log("v1x:" + v1x + " v1y:" + v1y + " ax:" + ax + " ay:" + ay + " vX: " + vX + " vY: " + vY + " xPos: " + xPos + " yPos: " + yPos);

    if (runFlag == 1) {
        completeDisplay = false;
        context.clearRect(0, 0, 480, 360);
        index = index + 1;
        time = index / 20.0;

        // the equation of motion
        x1 = xBase + x1Init + scalingFactor * (v1x * time + 0.5 * ax * time * time);
        y1 = yBase + y1Init + scalingFactor * (v1y * time + 0.5 * ay * time * time);

        //positions are equal
        xPos = x1 - xBase;
        yPos = y1 - yBase;

        // Draws sphere
        context.fillStyle = "#0000FF";
        context.strokeStyle = "#0000FF";
        context.beginPath();
        context.arc(x1, y1, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();

        vX = Number(v1x) + (ax * time);
        vY = Number(v1y) + (ay * time);

        //arrow shows direction ball is headed, the 3
        arrowX = ((3 * vX) + x1);
        arrowY = (y1 + (3 * vY));

        if (vCheck)
            arrow(x1, y1, arrowX, arrowY, 2, "#FF0000", "", 10);

        if (vXCheck)
            arrow(x1, y1, arrowX, y1, 2, "#00FF00", "", 10);

        if (vYCheck)
            arrow(x1, y1, x1, arrowY, 2, "#0000FF", "", 10);

        //console.log("pXGCheck: " + pXGCheck + ", pYGCheck: "+ pYGCheck + ", vXGCheck: "+ vXGCheck + ", vYGCheck: " + vYGCheck);

        // calls drawGrid function with different parameters correlating to whatever radio button is pressed.
        if (pXGCheck)
            drawGrid(true, false, false, false);

        if (pYGCheck)
            drawGrid(false, true, false, false);

        if (vXGCheck)
            drawGrid(false, false, true, false);

        if (vYGCheck)
            drawGrid(false, false, false, true);

        //new values are displayed at each iteration of drawMotion
        displayValues();
    }
}

function runMotion() {
    drawMotion();
    displayValues();

    ghost();

    if (runFlag == 1) {
        timer = window.setTimeout(runMotion, 100 / 3);
    }
}

function displayValues() {
    ctx2.clearRect(0, 0, 200, 360);

    ctx2.font = '16pt Calibri';
    ctx2.fillStyle = 'black';
    var timeLabel = 't = ';
    timeLabel = timeLabel + time.toFixed(2) + ' s';
    ctx2.fillText(timeLabel, xBase2, yBase2);

    var x1Label = 'x = ';
    x1Label = x1Label + Number(xPos / scalingFactor).toFixed(2) + ' m';
    ctx2.fillText(x1Label, xBase2, (yBase2 + 40));

    var y1Label = 'y = ';
    y1Label = y1Label + Number(yPos / scalingFactor).toFixed(2) + ' m';
    ctx2.fillText(y1Label, xBase2, (yBase2 + 80));

    var vXLabel = 'vx = ';
    vXLabel = vXLabel + Number(vX).toFixed(2) + ' m/s';
    ctx2.fillText(vXLabel, xBase2, (yBase2 + 120));

    var vYLabel = 'vy = ';
    vYLabel = vYLabel + Number(vY).toFixed(2) + ' m/s';
    ctx2.fillText(vYLabel, xBase2, (yBase2 + 160));

    if (completeDisplay) {
        ctx2.fillText('Animation Complete', 15, (yBase2 + 200));
    }
}

function ghost() {
    var ghostCount = 0;
    for (ival = 1; ival <= (index); ival += 10) {
        ghostCount = ghostCount + 1;
        var xGhost = xBase + 1 + (1 * x1Init + scalingFactor * v1x * (ival / 20) + 0.5 * scalingFactor * ax * (ival / 20) * (ival / 20));
        var yGhost = yBase + 1 + (1 * y1Init + scalingFactor * v1y * (ival / 20) + 0.5 * scalingFactor * ay * (ival / 20) * (ival / 20));

        context.fillStyle = "#808080";
        context.strokeStyle = "#808080";
        context.beginPath();
        context.arc(xGhost, yGhost, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        //console.log("In the ghosting for loop function, with ghostCount = " + ghostCount + " x1init = " + x1Init + " y1Init = " + y1Init + " xGhost = " + xGhost + " yGhost = " + yGhost + " time = " + time);

        if (ghostCount == 20) {
            context.beginPath();
            context.arc(xGhost, yGhost, radius, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            ghostCount = 0;
        }
    }
}

function play() {
    window.clearTimeout(timer);
    runFlag = 1;
    runMotion();

}

function pause() {
    window.clearTimeout(timer);
    runFlag = 0;

}

function stepForward() {
    window.clearTimeout(timer);
    runFlag = 1;
    drawMotion();

}

function stepBack() {
    window.clearTimeout(timer);
    index = index - 2;
    if (index < -1) index = -1;
    time = index / 20;
    runFlag = 1;
    drawMotion();

}

function reset() {
    window.clearTimeout(timer);
    index = -1;
    time = 0.0;
    x1 = xBase;
    y1 = yBase;
    runFlag = 1;
    ctx2.clearRect(0, 0, 200, 300);
    ctx4.clearRect(0, 0, 480, 360);
    ctx4.closePath();
    ctx4.beginPath();
    drawMotion();
}


function pXGraph() {
    const pXBox = document.querySelector('#positionXGraph');
    if (pXBox.checked) {
        pXGCheck = true;
        pYGCheck = false;
        vYGCheck = false;
        vXGCheck = false;
    } else
        pXGCheck = false;
    reset();
}

function pYGraph() {
    const pYBox = document.querySelector('#positionYGraph');
    if (pYBox.checked) {
        pYGCheck = true;
        pXGCheck = false;
        vXGCheck = false;
        vYGCheck = false;
    } else
        pYGCheck = false;
    reset();
}

function vXGraph() {
    const vXGBox = document.querySelector('#velocityXGraph');
    if (vXGBox.checked) {
        vXGCheck = true;
        pXGCheck = false;
        pYGCheck = false;
        vYGCheck = false;
    } else
        vXGCheck = false;
    reset();
}

/**
*  
*/
function vYGraph() {
    const vYGBox = document.querySelector('#velocityYGraph');
    if (vYGBox.checked) {
        vYGCheck = true;
        vXGCheck = false;
        pXGCheck = false;
        pYGCheck = false;
    }
    else
        vYGCheck = false;
    reset();
}


function checkV() {
    const vBox = document.querySelector('#velocity');
    if (vBox.checked)
        vCheck = true;
    else
        vCheck = false;
    reset();
}

function checkVX() {
    const vXBox = document.querySelector('#velocityX');
    if (vXBox.checked)
        vXCheck = true;
    else
        vXCheck = false;
    reset();
}

function checkVY() {
    const vYBox = document.querySelector('#velocityY');
    if (vYBox.checked)
        vYCheck = true;
    else
        vYCheck = false;
    reset();
}


function showx1Value(newx1Value) {
    //get the element
    var display = document.getElementById("initialx1Value");
    //show the amount
    display.innerHTML = newx1Value / 4;
    //set initial value
    x1Init = Number(newx1Value);
    reset();
}

function showy1Value(newy1Value) {
    //get the element
    var display = document.getElementById("initialy1Value");
    //show the amount
    display.innerHTML = newy1Value / 4;
    //set initial value
    y1Init = Number(newy1Value);
    reset();
}

function showv1xValue(newv1xValue) {
    //get the element
    var display = document.getElementById("initialv1xValue");
    //show the amount
    display.innerHTML = newv1xValue;
    //set initial value
    v1x = newv1xValue;
    reset();
}

function showv1yValue(newv1yValue) {
    //get the element
    var display = document.getElementById("initialv1yValue");
    //show the amount
    display.innerHTML = newv1yValue;
    //set initial value
    v1y = newv1yValue;
    reset();
}

function showaxValue(newaxValue) {
    //get the element
    var display = document.getElementById("initialaxValue");
    //set value
    ax = newaxValue - 12;
    //show the amount
    display.innerHTML = ax.toFixed(1);
    reset();
}

function showayValue(newayValue) {
    //get the element
    var display = document.getElementById("initialayValue");
    //set value
    ay = newayValue - 12;
    //show the amount
    display.innerHTML = ay.toFixed(1);
    reset();
}


/*ARROW ATTRIBUTES
x1, y1: start point
x2, y2: endpoint
w: width
c: color
*/
function arrow(x1, y1, x2, y2, w, col, txt, spc) {
    if (!w) w = 1;// If line thickness is not defined, default value
    if (!txt) txt = "";
    if (!spc) spc = 5;
    if (!col) col = context.strokeStyle;
    context.fillStyle = col;
    context.strokeStyle = col;
    var dx = x2 - x1, dy = y2 - y1; // Vector coordinates
    var length = Math.sqrt(dx * dx + dy * dy);// length
    //alert(x1+"\n"+y1+"\n"+x2+"\n"+y2+"\n"+w+"\n"+length);
    if (length == 0) return; // Abort if length is 0
    dx /= length; dy /= length; // unit vector
    var s = 2.5 * w + 7.5; // Length of arrowhead
    var xSp = x2 - s * dx, ySp = y2 - s * dy;// Help point for arrowhead
    var h = 0.5 * w + 3.5; // Half width of the arrowhead
    var xSp1 = xSp - h * dy, ySp1 = ySp + h * dx; // Corner of the arrowhead
    var xSp2 = xSp + h * dy, ySp2 = ySp - h * dx; // Corner of the arrowhead
    xSp = x2 - 0.6 * s * dx; ySp = y2 - 0.6 * s * dy; // Re-entrant corner of the arrowhead
    context.beginPath();// New path
    context.lineWidth = w; // line thickness
    context.moveTo(x1, y1); // start point
    if (length < 5) context.lineTo(x2, y2); // If short arrow, continue to end point, ...
    else context.lineTo(xSp, ySp); // ... otherwise continue to the re-entrant corner
    context.stroke(); // draw line
    if (length < 5) return;// If short arrow, no tip
    context.beginPath();// New path for arrowhead
    context.fillStyle = context.strokeStyle; // fill color same as line color
    context.moveTo(xSp, ySp); // start point (re-entrant corner)
    context.lineTo(xSp1, ySp1); // Advance to the point on a page
    context.lineTo(x2, y2); // Next to the top
    context.lineTo(xSp2, ySp2); // Continue to the point on the other side
    context.closePath();// Back to the starting point
    context.fill(); // draw arrowhead 
    if (x2 <= mx) { var tspc = -(3 * spc); }
    else { tspc = spc / 2; }
    context.fillText(txt, ((x2) + tspc), ((y2)) + spc);
}