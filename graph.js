const svgs = document.getElementsByTagName('svg')[0];

svgs.addEventListener('click', (event) => {
    vertexOnClick(event);
});

function vertexOnClick(event){
    const point = svgs.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const svgPoint = point.matrixTransform(svgs.getScreenCTM().inverse());

    const x = svgPoint.x;
    const y = svgPoint.y;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", "blue");

    svgs.appendChild(circle);
}