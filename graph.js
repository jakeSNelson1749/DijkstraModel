// TO DO:

// ------- BUGS -------
// - What happens when a duplicate edge is added?
// - Throw error when user tries to make duplicate vertex label
// - Fix the bug where text can be selected as a vertex
// - Clean up data consistency between graph data structure and svg elements when vertices are deleted
// - Make weight visible on verticle edges

// ------- BUGS - JAKE -----\
// - When invalid edge entered vertex remains selected

// ------- FEATURES TO ADD -------
// - ability to remove vertices and edges
// - Shortest path visualization (dijkstra's algorithm)

const svgs = document.getElementsByTagName('svg')[0];
const vertexList = [];
const edgeList = [];
let vertexSelected = null;
let vertexIdCounter = 0;

// UMKC demo data with preset vertices and edges
const UMKC_DEMO = {
    // Used LLM to generate coordinates for vertices based on a jpg map of UMKC, not perfect but good enough for demo purposes
    vertices: [
        { label: "Katz Hall", x: 930, y: 700 },
        { label: "Student Union", x: 360, y: 760 },
        { label: "Swinney Center", x: 575, y: 610 },
        { label: "Miller Nichols", x: 760, y: 800 },

        { label: "Bloch Hall", x: 375, y: 900 },
        { label: "School of Law", x: 315, y: 1150 },

        { label: "School of Education", x: 600, y: 1210 },
        { label: "Royall Hall", x: 725, y: 1050 },
        { label: "Rockhill Garage", x: 850, y: 1150 }
    ],

    edges: [
        { from: "Bloch Hall", to: "School of Law", weight: 2 },
        { from: "School of Law", to: "School of Education", weight: 4 },

        { from: "Student Union", to: "Swinney Center", weight: 2 },
        { from: "Swinney Center", to: "Miller Nichols", weight: 2 },
        { from: "Miller Nichols", to: "Katz Hall", weight: 3 },

        { from: "School of Education", to: "Royall Hall", weight: 2 },
        { from: "Royall Hall", to: "Rockhill Garage", weight: 1 },
        { from: "Rockhill Garage", to: "Miller Nichols", weight: 3 },
        { from: "Rockhill Garage", to: "School of Education", weight: 1 },

        { from: "Student Union", to: "Miller Nichols", weight: 2 },
        { from: "Bloch Hall", to: "Student Union", weight: 3 }
    ]
};

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
            let weight = prompt("Enter edge weight:");
            weight = weight.trim();
            if (weight === null || weight === "") {
                alert("Edge creation cancelled.");
                return;
            }
            if(!isNaN(Number(weight)) && Number(weight) >= 1){
                weight = Number(weight);
            }
            else{
                alert("Weight must be a positive number, edge canceled");
                return;
            }

            // Create an edge object to store the edge information and add it to the edgeList
            const edge = {
                startId: firstVertex.id,
                endId: secondVertex.id,
                weight: weight
            }

            edgeList.push(edge);

            //add edge to data structure and update lists
            currentGraph.add_edge(firstVertex.label, secondVertex.label, weight);
            currentGraph.print_vertices();

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
            weightText.setAttribute("font-size", "30");
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

function addToDropdowns(value){
    const sselect = document.getElementById("start_select");
    const eselect = document.getElementById("end_select");

    const option = new Option(value, value);
    const option2 = new Option(value, value);
    sselect.add(option);
    eselect.add(option2);
}

// FUnction for resetting the graph and clearing all vertices and edges from the display and data structure
function resetGraphDemo() {
    svgs.innerHTML = `<rect width="1200" height="1553" fill="white" />`;

    vertexList.length = 0;
    edgeList.length = 0;
    vertexSelected = null;
    vertexIdCounter = 0;

    currentGraph.vertices.clear();

    document.getElementById("adj-list").textContent = "Vertices:\n EMPTY";
    document.getElementById("results").textContent = "";

    document.getElementById("start_select").innerHTML =
        `<option value="">Select starting vertex</option>`;

    document.getElementById("end_select").innerHTML =
        `<option value="">Select ending vertex</option>`;
}

// Creates a vertex for the demo with given label and coordinates
function createDemoVertex(label, x, y) {
    const vertex = {
        id: vertexIdCounter,
        label: label,
        x: x,
        y: y
    };

    vertexList.push(vertex);
    currentGraph.add_vertex(label);
    addToDropdowns(label);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 30);
    circle.setAttribute("fill", "blue");
    circle.dataset.vertexId = vertex.id;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y - 28);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "30");
    text.textContent = label;
    text.dataset.vertexId = vertex.id;

    svgs.appendChild(circle);
    svgs.appendChild(text);

    vertexIdCounter++;
}

// Creates demo edges
function createDemoEdge(startLabel, endLabel, weight) {
    const firstVertex = vertexList.find(vertex => vertex.label === startLabel);
    const secondVertex = vertexList.find(vertex => vertex.label === endLabel);

    if (!firstVertex || !secondVertex) {
        return;
    }

    edgeList.push({
        startId: firstVertex.id,
        endId: secondVertex.id,
        weight: weight
    });

    currentGraph.add_edge(startLabel, endLabel, weight);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", firstVertex.x);
    line.setAttribute("y1", firstVertex.y);
    line.setAttribute("x2", secondVertex.x);
    line.setAttribute("y2", secondVertex.y);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "5");

    const midX = (firstVertex.x + secondVertex.x) / 2;
    const midY = (firstVertex.y + secondVertex.y) / 2;

    const weightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    weightText.setAttribute("x", midX);
    weightText.setAttribute("y", midY - 10);
    weightText.setAttribute("text-anchor", "middle");
    weightText.setAttribute("font-size", "24");
    weightText.setAttribute("fill", "black");
    weightText.textContent = weight;

    svgs.appendChild(line);
    svgs.appendChild(weightText);
}

// Loads the UMKC demo graph with preset vertices and edges onto the display and data structure
function loadUMKCDemo() {
    resetGraphDemo();

    document.getElementById("demo-map-section").classList.remove("hidden");

    UMKC_DEMO.vertices.forEach(vertex => {
        createDemoVertex(vertex.label, vertex.x, vertex.y);
    });

    UMKC_DEMO.edges.forEach(edge => {
        createDemoEdge(edge.from, edge.to, edge.weight);
    });

    currentGraph.print_vertices();
}

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
    circle.setAttribute("r", 30);
    circle.setAttribute("fill", "blue");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y - 40);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "30");
    text.textContent = label;

    // Add vertex to graph data structure and update display
    currentGraph.add_vertex(vertex.label);
    currentGraph.print_vertices();

    // Add vertex to drop down menus
    addToDropdowns(vertex.label);

    // Add to dataset for later retrieval of vertex information when clicked
    circle.dataset.vertexId = vertex.id;
    text.dataset.vertexId = vertex.id;

    svgs.appendChild(circle);
    svgs.appendChild(text);

    vertexIdCounter = vertexIdCounter + 1;
}

document.getElementById("run-demo-btn").addEventListener("click", loadUMKCDemo);