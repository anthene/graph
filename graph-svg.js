var js2xmlparser = require('js2xmlparser');

module.exports = function (graph) {
	var scale = { x: 7, y: 7 };
	var raduis = 10;
	var width = 100 * scale.x;
	var height = 100 * scale.y;

	var nodes = [];
	var edges = [];

	graph.forEachVertex(function (i) {

		var coords = graph.getVertexCoords(i, scale);

		nodes.push({
			'@': {
				cx: coords.x,
				cy: coords.y,
				r: raduis
			}
		});
	});

	graph.forEachEdge(function (i, j) {

		var iCoords = graph.getVertexCoords(i, scale);
		var jCoords = graph.getVertexCoords(j, scale);

		edges.push({
			'@': {
				x1: iCoords.x,
				x2: jCoords.x,
				y1: iCoords.y,
				y2: jCoords.y
			}
		});
	});

	return js2xmlparser("svg",
		{
			'@':
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: width,
				height: height,
				style: 'stroke:black;stroke-width:3;fill:red'
			},
			line: edges,
			circle: nodes
		});
};
