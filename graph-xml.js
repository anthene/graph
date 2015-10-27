var xml2js = require('xml2js').parseString;
var Graph = require('./graph');

module.exports = function() {
this.deserialize = function (xml, callback) {
	xml2js(xml, function (error, result) {
		try {
			var graph = new Graph(parseInt(result.graph.$.vertexCount), result.graph.$.name);

			for (var i = 0; result.graph.vertex && i < result.graph.vertex.length; i++) {
				var vertex = result.graph.vertex[i].$;
				graph.setVertex(i, {
					x: vertex.x ? parseInt(vertex.x) : undefined,
					y: vertex.y ? parseInt(vertex.y) : undefined,
					circle: vertex.circle ? parseInt(vertex.circle) : undefined
				});
				if (vertex.circle)
					graph.setVertexCircle(i, parseInt(vertex.circle));
			}

			for (var i = 0; result.graph.edge && i < result.graph.edge.length; i++) {
				var edge = result.graph.edge[i].$;
				graph.setEdge(parseInt(edge.firstVertex), parseInt(edge.secondVertex));
			}

			callback(null, graph);
		} catch (err) {
			callback(err, null);
		}

	});
}
};