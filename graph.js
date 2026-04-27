// TO DO:

// ------- BUGS -------
// - What happens when a duplicate edge is added?
// - Throw error when user tries to make duplicate vertex label
// - Fix the bug where text can be selected as a vertex
// - Clean up data consistency between graph data structure and svg elements when vertices are deleted
// - Make weight visible on verticle edges

// ------- FEATURES TO ADD -------
// - Ability to remove vertices and edges
// - Shortest path visualization (dijkstra's algorithm)

const svgs = document.getElementsByTagName('svg')[0];
const vertexList = [];
const edgeList = [];
let vertexSelected = null;
let vertexIdCounter = 0;

// Listen for a click event on the SVG element, check if its on a vertex
svgs.addEventListener('click', (event) => {
    // detects if vertex element is clicked
    const clickedElement = event.target;
    
    // When empty space is clicked
    if (clickedElement === svgs || clickedElement.tagName === 'rect') {
        // If a vertex is already selected, deselect it
        if (vertexSelected !== null) {
            vertexSelected.setAttribute("fill", "blue");
            vertexSelected = null;
        }
        // Otherwise create a new vertex
        else {
            vertexOnClick(event);
        }
    }

    // When vertex is clicked
    else {
        // Get the vertex information from the dataset of the clicked element
        const clickedVertexId = clickedElement.dataset.vertexId;
        const clickedVertex = vertexList.find(vertex => vertex.id.toString() === clickedVertexId);

        // Case 1: If no vertex currently selected, select the clicked vertex
        if (vertexSelected === null) {
            clickedElement.setAttribute("fill", "red");
            vertexSelected = clickedElement;
        }

        // Case 2: If the same selected vertex clicked again, prompt to delete vertex and connected edges
        else if (vertexSelected === clickedElement) {
            const shouldDelete = confirm("Delete vertex? This will also delete all connected edges.");

            if (shouldDelete) {
                alert("I am still working on vertex deletion.");
            }
        }

        // Case 3: If a different vertex clicked while one is already selected, create an edge between the two vertices with user input weight
        else {
            // Get the vertex information for both the currently selected vertex and the newly clicked vertex
            const firstVertexId = vertexSelected.dataset.vertexId;
            const secondVertexId = clickedElement.dataset.vertexId;

            // Find the vertex objects in the vertexList using the retrieved vertex IDs
            const firstVertex = vertexList.find(vertex => vertex.id.toString() === firstVertexId);
            const secondVertex = vertexList.find(vertex => vertex.id.toString() === secondVertexId);

            // Prompt user to input weight for the edge, throw error if empty or null
            const weight = prompt("Enter edge weight:");

            if (weight === null || weight.trim() === "") {
                alert("Edge creation cancelled.");
                return;
            }

            // Create an edge object to store the edge information and add it to the edgeList
            const edge = {
                startId: firstVertex.id,
                endId: secondVertex.id,
                weight: weight
            }

            edgeList.push(edge);

            // Create the SVG elements for the edge line
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", firstVertex.x);
            line.setAttribute("y1", firstVertex.y);
            line.setAttribute("x2", secondVertex.x);
            line.setAttribute("y2", secondVertex.y);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "4");

            // Get the mid point to place the weight label
            const midX = (firstVertex.x + secondVertex.x) / 2;
            const midY = (firstVertex.y + secondVertex.y) / 2;

            // Create the SVG elements for the weight text
            const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            weightText.setAttribute("x", midX);
            weightText.setAttribute("y", midY - 5);
            weightText.setAttribute("text-anchor", "middle");
            weightText.textContent = weight;

            // Add the line and weight text to the SVG
            svgs.appendChild(weightText);
            svgs.appendChild(line);

            // Reset the color of the previously selected vertex and clear the selection
            vertexSelected.setAttribute("fill", "blue");
            vertexSelected = null;
        }
    }
});

function vertexOnClick(event){
    const point = svgs.createSVGPoint();

    // Get the mouse position relative to the SVG element
    point.x = event.clientX;
    point.y = event.clientY;

    // Transform the mouse coordinates to SVG coordinates
    const svgPoint = point.matrixTransform(svgs.getScreenCTM().inverse());

    // Create a circle element at the clicked position
    const x = svgPoint.x;
    const y = svgPoint.y;

    // Prompt user to input label for vertex, throw error if empty, null, or already exists
    const label = prompt("Enter a label for the vertex: ");

    if (label === null || label.trim() === "") {
        alert("Label cannot be empty. Vertex creation cancelled.");
        return;
    }

    // Create a vertex object to store the vertex information and then increment the vertexIdCounter for the next vertex
    const vertex = {
        id: vertexIdCounter,
        label: label,
        x: x,
        y: y,
    }
    vertexList.push(vertex);

    // Create the SVG elements for the vertex (circle and text)
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", "blue");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y - 25);
    text.setAttribute("text-anchor", "middle");
    text.textContent = label;

    // Add vertex to graph data structure and print vertices
    currentGraph.add_vertex(vertex);
    currentGraph.print_vertices();

    // Add to dataset for later retrieval of vertex information when clicked
    circle.dataset.vertexId = vertex.id;
    text.dataset.vertexId = vertex.id;

    svgs.appendChild(circle);
    svgs.appendChild(text);

    vertexIdCounter = vertexIdCounter + 1;
}