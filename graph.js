module.exports = function (vertexCount, name) {

	this.name = name;

	var vertices = [];
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

		return this;
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

		return this;
	}

	this.forEachVertex = function (action) {
		for (var i = 0; i < vertexCount; i++) {
			action(i, vertexCount);
		}

		return this;
	}

	this.forEachEdge = function (action) {
		for (var i = 0; i < vertexCount; i++) {
			for (var j = i + 1; j < vertexCount; j++) {
				if (edges[i][j])
					action(i, j, vertexCount);
			}
		}

		return this;
	}
	
	this.getVertexCoords = function (i, scale) {


		var vertex = this.getVertex(i);
		if (vertex && vertex.x && vertex.y)
			return { x: vertex.x * scale.x, y: vertex.y * scale.y };

		var margin = 5;
		var vertexAngle = 2 * Math.PI * (i / vertexCount);
		var center = { x: 50 * scale.x, y: 50 * scale.y };
		var radiusX = (50 - margin) * scale.x;
		var radiusY = (50 - margin) * scale.y;
		var radius = Math.sqrt(1 / (Math.pow(Math.sin(vertexAngle) / radiusX , 2) + Math.pow(Math.cos(vertexAngle) / radiusY , 2)));
		
		return {
			x: center.x + radius * Math.sin(vertexAngle),
			y: center.y - radius * Math.cos(vertexAngle),
		};
	}

	this.getNeighbours = function (i) {
		var neighbours = [];
		for (var j = 0; j < vertexCount; j++) {
			if (edges[i][j])
				neighbours.push(j);
		}

		return neighbours;
	};

	var count = function(array) {
		var result = 0;

		for (var i = 0; i < array.length; i++)
			result += array[i].length;

		return result;
	};

	var arrDiff = function(a1, a2) {
		var result = [];

		for (var i = 0; i < a1.length; i++)
			if (a2.indexOf(a1[i]) == -1)
				result.push(a1[i]);

		return result;
	}

	this.getLevels = function(i) {
		var result = [];
		var levelIndex = 0;
		var level = [i];
		var passed = [i];
		result[levelIndex] = level;

		while (passed.length < vertexCount) {
			levelIndex++;
			var newLevel = [];
			for (var j = 0; j < level.length; j++)
				newLevel = newLevel.concat(arrDiff(this.getNeighbours(level[j]), newLevel));
			newLevel = arrDiff(newLevel, passed).sort();
			passed = passed.concat(newLevel).sort();
			result[levelIndex] = newLevel;
			level = newLevel;
		}

		return result;
	};
};
