let inputContext;
let drawContext
let circleContext;
let lineContext;

let circleNumber = 30;
let deltat = 0.001;
let points = [];
let cn = [];

let startTime;
let period = 10;

let startedDrawing = false;
let continueDrawing =  false;

window.onload = () =>
{
    inputContext = inputCanvas.getContext("2d");
    drawContext = drawCanvas.getContext("2d");
    circleContext = circleCanvas.getContext("2d");
    lineContext = lineCanvas.getContext("2d");

    inputContext.strokeStyle = "gray";
    circleContext.strokeStyle = "blue";
    lineContext.strokeStyle = "black";
    drawContext.strokeStyle = "red";
    drawContext.lineWidth = 2;

    circleNumberRange.onchange = () =>
    {
        circleNumber = circleNumberRange.value;
        circleNumberInput.value = circleNumber * 2;
        drawButton.onclick();
    }
    circleNumberInput.onchange = () =>
    {
        let value = Number(circleNumberInput.value);
        if(value < 1)
            value = 2;
        if(value > 200)
            value = 200;
        value += value % 2;

        circleNumber = value / 2;
        circleNumberRange.value = value / 2;
        circleNumberInput.value = value;
        drawButton.onclick();
    }

    lineCanvas.onmousedown = e => 
    {
        
        if(e.buttons == 1)
        {
            let point = {x: e.offsetX, y: e.offsetY};
            points = [point];
            inputContext.closePath();
            inputContext.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
            inputContext.beginPath();
            inputContext.moveTo(point.x, point.y);

            continueDrawing = false;
        }
    }

    lineCanvas.onmousemove = e =>
    {
        if(e.buttons == 1)
        {
            let point = {x: e.offsetX, y: e.offsetY};
            points.push(point);
            inputContext.lineTo(point.x, point.y);
            inputContext.stroke();
        }
    }

    drawButton.onclick = () =>
    {
        if(points.length <= 0)
            return;
        
        cn = [];
        for(let n = -circleNumber; n <= circleNumber; n++)
        {
            let c = {x: 0, y: 0};
            for(let t = 0; t <= 1; t += deltat)
            {
                c = cadd(c, crmult(cmult(getPoint(t), cis(-2*n*t*Math.PI)), deltat));
            }
            cn[n] = c;
        }

        lineContext.closePath();
        lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        circleContext.closePath();
        circleContext.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
        drawContext.closePath();
        drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        startTime = Date.now();
        startedDrawing = false;
        continueDrawing = true;
        requestAnimationFrame(updateCircles);
    }

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'drawpoints.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            points = JSON.parse(xobj.responseText);
            lineContext.moveTo(0,0);
            lineContext.beginPath();
            points.forEach(p => {
                lineContext.lineTo(p.x, p.y);
            });
            lineContext.stroke();
            lineContext.closePath()
            drawButton.onclick();
          }
    };
    xobj.send(null);  
}

let updateCircles = () =>
{
    lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    circleContext.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

    lineContext.beginPath();

    let t = (Date.now() - startTime) / 1000 / period;
    let p = cn[0];
    lineContext.moveTo(p.x, p.y);
    for(let n = 1; n <= circleNumber; n++)
    {
        let v = cmult(cn[n], cis(2 * n * t * Math.PI)); 
        circleContext.beginPath();
        circleContext.arc(p.x, p.y, abs(v), 0, 2 * Math.PI);
        circleContext.stroke();
        circleContext.closePath();

        p = cadd(p, v);
        lineContext.lineTo(p.x, p.y);
        
        v = cmult(cn[-n], cis(-2 * n * t * Math.PI))
        circleContext.beginPath();
        circleContext.arc(p.x, p.y, abs(v), 0, 2 * Math.PI);
        circleContext.stroke();
        circleContext.closePath();

        p = cadd(p, v);
        lineContext.lineTo(p.x, p.y);
        
    }
    lineContext.stroke();
    lineContext.closePath();

    if(!startedDrawing)
    {   
        drawContext.beginPath();
        drawContext.moveTo(p.x, p.y);
        startedDrawing = true;
    }
    else
    {
        drawContext.lineTo(p.x, p.y);
        drawContext.stroke();
        drawContext.moveTo(p.x, p.y);
    }

    if(continueDrawing)
        requestAnimationFrame(updateCircles);
    else
    {        
        lineContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        circleContext.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
        drawContext.closePath();
        drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }

}

let cis = (a) =>
{
    return {x: Math.cos(a), y: Math.sin(a)};
}

let cmult = (a, b) =>
{
    return {x: a.x * b.x - a.y * b.y, y: a.x * b.y + a.y * b.x};
}

let crmult = (a, b) =>
{
    return {x: a.x * b, y: a.y * b};
}

let cadd = (a, b) =>
{
    return {x: a.x + b.x, y: a.y + b.y};
}

let abs = (a) =>
{
    return Math.sqrt((a.x * a.x) + (a.y * a.y));
}
let getPoint = (a) =>
{
    let a1 = (points.length - 1) * a;
    let amin = Math.floor(a1);
    let amax = Math.ceil(a1);

    if(amin == amax)
        return points[amin];
    return cadd(crmult(points[amin], (amax - a1)), crmult(points[amax], (a1 - amin)));
}