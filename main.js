let circleNumber = 61;
let points = [];

let inputContext;
let drawContext
let circleContext;
window.onload = () =>
{
    inputContext = inputCanvas.getContext("2d");
    drawContext = drawCanvas.getContext("2d");
    circleContext = circleCanvas.getContext("2d");

    circleNumberRange.onchange = () =>
    {
        circleNumberOutput.value = circleNumberRange.value * 2;
        circleNumber = circleNumberRange.value * 2 + 1;
    }

    inputCanvas.onmousedown = e => 
    {
        
        if(e.buttons == 1)
        {
            let point = {x: e.offsetX, y: e.offsetY};
            points = [point];
            inputContext.closePath();
            inputContext.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
            inputContext.beginPath();
            inputContext.moveTo(point.x, point.y);
        }
    }

    inputCanvas.onmousemove = e =>
    {
        if(e.buttons == 1)
        {
            let point = {x: e.offsetX, y: e.offsetY};
            points.push(point);
            inputContext.lineTo(point.x, point.y);
            inputContext.stroke();
        }
    }

    inputCanvas.onmouseup = e => 
    {
        if(e.buttons = 1)
        {
            console.table(points);
        }
    }
}