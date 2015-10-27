module.exports = function (vertexCount, name) {

	var i, j;
	var vertices = [];
    var edges = [];
    var circles = [[]];

	for (i = 0; i < vertexCount; i++) {
		edges[i] = [];
		for (j = 0; j < vertexCount; j++) {
			edges[i][j] = false;
		}
	}
	
	for (i = 0; i < vertexCount; i++) {
		circles[0].push(i);
	}

	Object.defineProperty(this, 'name', {
		enumerable: true,
		value: name
	});

	Object.defineProperty(this, 'vertexCount', {
		value: vertexCount
	});
	
	Object.defineProperty(this, 'edges', {
		enumerable: true,
		value: []
	})
		
	for (i = 0; i < vertexCount; i++) {
		Object.defineProperty(this.edges, i, {
			enumerable: true,
			value: []
		})
		for (j = 0; j < vertexCount; j++) {
			Object.defineProperty(this.edges[i], j, {
				enumerable: true,
				get: (function (i1, j1) {
					return function() {
						return edges[i1][j1];
					};
				})(i, j)
			})
		}
	}
	
	Object.defineProperty(this, 'verteces', {
		enumerable: true,
		value: []
	})

	for (i = 0; i < vertexCount; i++) {
		Object.defineProperty(this.verteces, i, {
			enumerable: true,
			get: (function (i1) {
				return function() {
					var vertex = vertices[i1];
					return {
						x: vertex ? vertex.x : undefined,
						y: vertex ? vertex.y : undefined,
						circle: (vertex && vertex.circle) ? vertex.circle : 0
					};
				}
			})(i)
		})
	}

	this.getVertex = function(i) {

        if (i >= vertexCount)
            throw new Error('Vertex index must me less than ' + vertexCount);

		return vertices[i];
	};

	this.setVertex = function(i, value) {

        if (i >= vertexCount)
            throw new Error('Vertex index must me less than ' + vertexCount);

		vertices[i] = value;
		return this;
	};

	this.getVertexCount = function () { return vertexCount; }

	this.getEdge = function (i, j) { return edges[i][j]; }

	this.setEdge = function (i, j, value) {

        if (i == j)
            throw new Error('A graph cannot contain loops');
			
		if (value === undefined)
			value = true;

		edges[i][j] = edges[j][i] = value;

		return this;
	}

	this.forEachVertex = function (action) {
		var i;
		
		for (i = 0; i < vertexCount; i++) {
			action(i, vertexCount);
		}

		return this;
	}

	this.forEachEdge = function (action) {
		var i, j;
		
		for (i = 0; i < vertexCount; i++) {
			for (j = i + 1; j < vertexCount; j++) {
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
		var circleIndex = this.getVertexCircle(i);
		var vertexAngle = 2 * Math.PI * (i / circles[circleIndex].length);
		var center = { x: 50 * scale.x, y: 50 * scale.y };
		var radiusX = (50 - margin) * scale.x;
		var radiusY = (50 - margin) * scale.y;
		var radius = Math.sqrt(1 / (Math.pow(Math.sin(vertexAngle) / radiusX , 2) + Math.pow(Math.cos(vertexAngle) / radiusY , 2)));
		radius = radius / (circleIndex + 1);
		
		return {
			x: center.x + radius * Math.sin(vertexAngle),
			y: center.y - radius * Math.cos(vertexAngle),
		};
	}

	this.getNeighbours = function (i) {
		var neighbours = [], j;
		for (j = 0; j < vertexCount; j++) {
			if (edges[i][j])
				neighbours.push(j);
		}

		return neighbours;
	};

	var arrDiff = function(a1, a2) {
		var result = [], i;

		for (i = 0; i < a1.length; i++)
			if (a2.indexOf(a1[i]) == -1)
				result.push(a1[i]);

		return result;
	}

	this.getLevels = function(i) {
		
		if (!this.isConnected())
			throw new Error('The graph is not connected');
		
		var result = [];
		var levelIndex = 0;
		var level = [i];
		var passed = [i];
		var newLevel, j;
		result[levelIndex] = level;

		while (passed.length < vertexCount) {
			levelIndex++;
			newLevel = [];
			for (j = 0; j < level.length; j++)
				newLevel = newLevel.concat(arrDiff(this.getNeighbours(level[j]), newLevel));
			newLevel = arrDiff(newLevel, passed).sort();
			passed = passed.concat(newLevel).sort();
			result[levelIndex] = newLevel;
			level = newLevel;
		}

		return result;
	};

	this.getVertexCircle = function (i) {
		var j;
		
		for (j = 0; j < circles.length; j++) {
			if (!circles[j]) circles[j] = [];
			if (circles[j].indexOf(i) > -1)
				return j;
		}

		throw new Error('Circles damaged.')
	}

	this.setVertexCircle = function (i, circleIndex) {
		var j, index;

		for (j = 0; j < circles.length; j++) {
			if (!circles[j]) circles[j] = [];
			index = circles[j].indexOf(i);
			if (index > -1) {
				circles[j].splice(index, 1);
				if (!circles[circleIndex]) circles[circleIndex] = [];
				circles[circleIndex].push(i);
				return this;
			}
		}

		throw new Error('Circles damaged.')
	};
	
	this.isConnected = function() {
		var firstConnectedIndex, i;
		var checkedVertices = [];
		var connectedAndCheckedCount = 0;
		var neighbours;
		checkedVertices[0] = 'connected'; // 'connected' means connected with 0 vertex
		
		do {
			
			firstConnectedIndex = undefined;
			for (i = 0; firstConnectedIndex === undefined && i < checkedVertices.length; i++) {
				if (checkedVertices[i] === 'connected')
					firstConnectedIndex = i;
			}
			
			if (firstConnectedIndex !== undefined) {
				
				checkedVertices[firstConnectedIndex] = 'connectedAndChecked';
				
				neighbours = this.getNeighbours(firstConnectedIndex);
				
				for (i = 0; i < neighbours.length; i++) {
					if (checkedVertices[neighbours[i]] === undefined)
						checkedVertices[neighbours[i]] = 'connected';
				}
			}
		}
		while (firstConnectedIndex !== undefined)
		
		for (i = 0; i < checkedVertices.length; i++) {
			if (checkedVertices[i] === 'connectedAndChecked')
				connectedAndCheckedCount++;
		}
		
		return connectedAndCheckedCount === vertexCount;
	};
	
	this.getBridges = function() {

		if (!this.isConnected())
			throw new Error('The graph is not connected');
			
		var graph = this;
		var result = [];
		
		this.forEachEdge(function (i, j) {
			graph.setEdge(i, j, false);
			if (!graph.isConnected())
				result.push([i, j]);
			graph.setEdge(i, j);
		});

		return result;
	};
};
