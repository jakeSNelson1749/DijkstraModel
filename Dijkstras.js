class Graph{
    constructor(){
        //initialize
        this.vertices = new Map();
        document.getElementById("adj-list").textContent = "Vertices:\n EMPTY";
    }
    add_vertex(newVertex){
        if (!this.vertices.has(newVertex)){
            this.vertices.set(newVertex, new Map());
        }
    }
    remove_vertex(vertex){
        if(!this.vertices.has(vertex)){
            return;
        }
        else{
            // remove from vertex list and remove as a neighbor from all vertices
            for(const [key, value] of this.vertices){
                if(key === vertex){
                    this.vertex.delete(key);
                }
                if(value.has(vertex)){
                    const innerMap = value;
                    innerMap.delete(vertex);
                }
            }
        }
    }
    add_edge(startV, endV, weight = 1.0){
        // ensures both vertices exist
        this.add_vertex(startV);
        this.add_vertex(endV);

        const startNeighbors = this.vertices.get(startV);
        const endNeighbors = this.vertices.get(endV);
        // add edge to neighbor list with weight
        if(startNeighbors && endNeighbors){
            startNeighbors.set(endV, weight);
            endNeighbors.set(startV, weight);
        }

    }
    remove_edge(startV, endV){
        //implement remove edge later
        return;
    }
    //updates the <p> with the adjacency list
    print_vertices(){
        // convert adjacency list into readable strings
        document.getElementById("adj-list").textContent = "Vertices:";
        for(const [key, value] of this.vertices){
            document.getElementById("adj-list").textContent += "\n"+key+" -> ";
            if(value.size != 0){
                for(const [Innerkey, Innervalue] of value){
                    document.getElementById("adj-list").textContent += Innerkey + ":"+Innervalue+", ";
                }
            }
        }
    }
    //runs djikstras and gets a list of distances and previous vertices 
    djikstras(start, end){
        const vertices_array = Array.from(this.vertices.keys());
        const unvisited = new Set(vertices_array);
        const distances = {};
        const previous = {};
        
        for(const v of vertices_array){
            distances[v] = Infinity;
            previous[v] = null;
        }

        distances[start] = 0;

        while(unvisited.size != 0){
            let current = null;
            for(const v of unvisited){
                if(current === null || distances[v] < distances[current]){
                    current = v;
                }
            }

            // smallest distance within unvisited is unreachable, break out of loop
            if(distances[current] === Infinity){
                break;
            }
            //processing this node, it has now been visited
            unvisited.delete(current);

            // parse neighbor list of current
            for(const [neighbor, weight] of this.vertices.get(current)){
                if(unvisited.has(neighbor)){
                    let checkDist = weight + distances[current];

                    if(checkDist < distances[neighbor]){
                        distances[neighbor] = checkDist;
                        previous[neighbor] = current;
                    }
                }
            }
        }
        //distances all correctly set, previous all correctly set
        
        //length is distances[end]
        //shortest_path is backwards
        const shortest_path = [];
        shortest_path.push(end);

        let previousV = previous[end];
        while(previousV != null){
            shortest_path.push(previousV);
            previousV = previous[previousV];
        }
        return [shortest_path.reverse(), distances[end]];
    }
}

function button_pressed(){
    const startSelect = document.getElementById("start_select");
    const endSelect = document.getElementById("end_select");

    const container = document.querySelector(".algorithm");
    const results = document.getElementById("results");
    if(startSelect.value === "" || endSelect.value === ""){
        results.textContent = "Please select valid vertices";
    }
    else{
        const djikstra_result = currentGraph.djikstras(startSelect.value, endSelect.value);
        results.textContent = "Shortest path: " + djikstra_result[0].join(" -> ") + "\nlength: "+djikstra_result[1];
    }
}

const currentGraph = new Graph();

//==== testing =====
// let index = 0;
// currentGraph.add_vertex("A");
// currentGraph.add_vertex("B");
// currentGraph.add_edge("A","B",17.0);
// currentGraph.print_vertices();