var xml2js = require('xml2js').parseString;
var Graph = require('./graph');

module.exports = function (xml, callback) {
	xml2js(xml, function (error, result) {
		try {
			var graph = new Graph(parseInt(result.edges.$.vertexCount), result.edges.$.name);

			for (var i = 0; i < result.edges.edge.length; i++) {
				var edge = result.edges.edge[i].$;
				graph.setEdge(parseInt(edge.firstVertex), parseInt(edge.secondVertex));
			}

			callback(null, graph);
		} catch (err) {
			callback(err, null);
		}

	});
};