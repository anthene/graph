var Graph = require('./graph');

module.exports = function () {
	this.petGenerate = function (k, d) {
		var graph = new Graph(2 * k);

		for (var i = 0; i < k; i++) {
			graph.setVertex(i);
			graph.setVertexCircle(i, 1);
			graph.setEdge(i, (i + d) % k);
			graph.setEdge(i, i + k);
		}

		for (var i = k; i < 2 * k; i++) {
			graph.setEdge(i, i == 2 * k - 1 ? k : i + 1);
		}

		return graph;
	}
}