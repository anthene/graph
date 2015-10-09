module.exports = function (vertexCount, name) {

	this.name = name;

	var graph = this;

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
};
