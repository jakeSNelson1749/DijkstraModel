class Graph{
    constructor(){
        //initialize necessary sets and lists
        this.vertices = new Map();
        document.getElementById("flag").textContent = "Vertices: EMPTY";
    }
    add_vertex(newVertex){
        if (!this.vertices.has(newVertex)){
            this.vertices.set(newVertex, new Map());
        }
    }
    print_vertices(){
        // convert keys into readable strings

        const vertexList = Array.from(this.vertices.keys()).join(", ");

        document.getElementById("flag").textContent = "Vertices: " + vertexList;
    }
}

function button_pressed(){
    index = index +1;
    //alert(index);
    myGraph.add_vertex(index.toString());
    myGraph.print_vertices();
}

const currentGraph = new Graph();
let index = 0;
//myGraph.add_vertex("A");