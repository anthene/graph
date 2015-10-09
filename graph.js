module.exports = function (vertexCount, name) {

	this.name = name;

	var graph = this;

	var vertices = new Array(vertexCount);
    var edges = [];

    var initEdges = function(edges) {
		for (var i = 0; i < vertexCount; i++) {
			edges[i] = [];
			for (var j = 0; j < vertexCount; j++) {
				edges[i][j] = false;
			}
		}
    }

	initEdges(edges);

	this.getVertex = function(i) { return vertices[i]; };

	this.setVertex = function(i, value) {
		vertices[i] = value;
	};

	this.getVertexCount = function () { return vertexCount; }

	this.getEdge = function (i, j) {

        if (i >= vertexCount || j >= vertexCount)
            throw 'Incorrect i or j';

		return edges[i][j];
	}

	this.setEdge = function (i, j, value) {
        
        if (i >= vertexCount || j >= vertexCount)
            throw 'Not good';
        
        if (i == j)
            throw 'No loops';

		edges[i][j] = !edges[i][j];
		edges[j][i] = !edges[j][i];

		return graph;
	}

	this.forEachVertex = function (action) {
		for (var i = 0; i < vertexCount; i++) {
			action(i, vertexCount);
		}
	}

	this.forEachEdge = function (action) {
		for (var i = 0; i < vertexCount; i++) {
			for (var j = i + 1; j < vertexCount; j++) {
				if (edges[i][j])
					action(i, j, vertexCount);
			}
		}
	}
	
	this.getVertexCoords = function (i, radius, scale) {

		var vertex = graph.getVertex(i);
		if (vertex && vertex.x && vertex.y)
			return { x: vertex.x * scale.x, y: vertex.y * scale.y };

		var vertexAngle = 2 * Math.PI * (i / vertexCount);

		var center = { x: 50 * scale.x, y: 50 * scale.y };
		
		return {
			x: center.x + (center.x - radius) * Math.sin(vertexAngle),
			y: center.y - (center.y - radius) * Math.cos(vertexAngle),
		};
	}
};
