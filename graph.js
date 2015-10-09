module.exports = function (vertexCount) {

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

		return graph;
	}
};
