var js2xmlparser = require('js2xmlparser');

module.exports.toSvg = function (graph) {
	var scale = { x: 7, y: 7 };
	var raduis = 1 * scale.x;
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

module.exports.toLeveledSvg = function (graph, i) {
	var scale = { x: 7, y: 7 };
	var raduis = 1 * scale.x;
	var width = 100 * scale.x;
	var height = 100 * scale.y;

	var nodes = [];
	var edges = [];

	var levels = graph.getLevels(i);
	var levelCount = levels.length;

	for (var i = 0; i < levels.length; i++) {
		var deltaY = height / (levels.length + 1)
		for (var j = 0; j < levels[i].length; j++) {
			var deltaX = width / (levels[i].length + 1)
			nodes[levels[i][j]] = {
				'@': {
					cx: (j + 1) * deltaX,
					cy: (i + 1) * deltaY,
					r: raduis
				}
			};
		}
	}

	graph.forEachEdge(function (i, j) {

		edges.push({
			'@': {
				x1: nodes[i]['@'].cx,
				x2: nodes[j]['@'].cx,
				y1: nodes[i]['@'].cy,
				y2: nodes[j]['@'].cy
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
}