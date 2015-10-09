var js2xmlparser = require('js2xmlparser');

module.exports = function (graph) {
	var side = 500;
	var raduis = 10;
	var half = side/2;
	var width = side;
	var height = side;

	var nodes = [];
	var edges = [];

	var getVertexCoords = function (i, vertexCount) {
		var vertexAngle = 2 * Math.PI * (i / vertexCount);

		return {
			x: half + (half - raduis) * Math.sin(vertexAngle),
			y: half - (half - raduis) * Math.cos(vertexAngle),
		};
	}

	graph.forEachVertex(function (i, vertexCount) {

		var coords = getVertexCoords(i, vertexCount);

		nodes.push({
			'@': {
				cx: coords.x,
				cy: coords.y,
				r: raduis,
			}
		});
	});

	graph.forEachEdge(function (i, j, vertexCount) {

		var iCoords = getVertexCoords(i, vertexCount);
		var jCoords = getVertexCoords(j, vertexCount);

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
		})
};
