var Graph = require('./graph');
var toSvg = require('./graph-svg').toSvg;
var toLeveledSvg = require('./graph-svg').toLeveledSvg;
var fromXml = require('./graph-xml');
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var key;
var properties = [];

// vertexCount
var graph = new Graph(3);
assert.strictEqual(graph.vertexCount, 3);
graph.vertexCount = "yes";
assert.strictEqual(graph.vertexCount, 3);

// edges
graph = new Graph(3, "edges test").setEdge(0, 1).setEdge(0, 2);
assert.strictEqual(graph.edges[0][1], true);
assert.strictEqual(graph.edges[1][0], true);
assert.strictEqual(graph.edges[0][2], true);
assert.strictEqual(graph.edges[2][0], true);
assert.strictEqual(graph.edges[1][2], false);
assert.strictEqual(graph.edges[2][1], false);
graph.edges[0][1] = false;
graph.edges[0][2] = false;
graph.edges[2][1] = true;
assert.strictEqual(graph.edges[0][1], true);
assert.strictEqual(graph.edges[1][0], true);
assert.strictEqual(graph.edges[0][2], true);
assert.strictEqual(graph.edges[2][0], true);
assert.strictEqual(graph.edges[1][2], false);
assert.strictEqual(graph.edges[2][1], false);

// verteces
graph = new Graph(3);
graph.setVertex(0, {x: 1, y: 2});
graph.setVertex(1, {});
graph.setVertex(2, {x: 3, y: 4, circle: 1});
assert.deepStrictEqual({x: 1, y: 2, circle: 0 }, graph.verteces[0]);
assert.deepStrictEqual({x: undefined, y: undefined, circle: 0 }, graph.verteces[1]);
assert.deepStrictEqual({x: 3, y: 4, circle: 1 }, graph.verteces[2]);
graph.verteces[0] = {x: 5};
graph.verteces[1] = {};
graph.verteces[2] = {y: 3};
assert.deepStrictEqual({x: 1, y: 2, circle: 0 }, graph.verteces[0]);
assert.deepStrictEqual({x: undefined, y: undefined, circle: 0 }, graph.verteces[1]);
assert.deepStrictEqual({x: 3, y: 4, circle: 1 }, graph.verteces[2]);

// property list
graph = new Graph(3);
for (key in graph) {
	if (typeof graph[key] !== "function"){
		properties.push(key);
	}
}
assert.deepEqual(["name", "edges", "verteces"], properties);
	
// getVertex
assert.strictEqual(undefined, new Graph(3).getVertex(2));

assert.throws(function () { new Graph(3).getVertex(3); }, function (error) { return error.message === 'Vertex index must me less than 3'; });

// setVertex
assert.deepEqual({x:1, y:2}, new Graph(3).setVertex(1, {x:1, y:2}).getVertex(1));

assert.throws(function () { new Graph(2).setVertex(3); }, function (error) { return error.message === 'Vertex index must me less than 2'; });

// getVertexCount
assert.equal(3, new Graph(3).getVertexCount());

// getEdge
assert.equal(false, new Graph(3).getEdge(0, 2));

assert.throws(function () { new Graph(3).getEdge(3, 1); }, function (error) { return true; });

// setEdge
assert.equal(true, new Graph(3).setEdge(1, 2).getEdge(1, 2));

assert.throws(function () { new Graph(3).setEdge(1, 1); }, function (error) { return error.message === 'A graph cannot contain loops'; });

assert.throws(function () { new Graph(3).setEdge(1, 4); }, function (error) { return true; });

// forEachVertex
var num = 0;
var action = function () { num++; };
new Graph(3).forEachVertex(action);
assert.equal(3, num);

var verteces = [];
var action = function (i) { verteces.push(i); };
new Graph(4).forEachVertex(action);
assert.deepEqual([0, 1, 2, 3], verteces);

// forEachEdge
var num = 0;
var action = function () { num++; };
new Graph(4).setEdge(0, 1).setEdge(1, 2).setEdge(3, 1).setEdge(2, 3).forEachEdge(action);
assert.equal(4, num);

var edges = [];
var action = function (i, j) { edges.push([i, j]); };
new Graph(4).setEdge(0, 1).setEdge(3, 1).forEachEdge(action);
assert.deepEqual([[0, 1], [1, 3]], edges);

// getVertex

// getVertexCoords
assert.deepEqual(
	{x:1,y:2},
	new Graph(6).setVertex(1, {x:1, y:1}).getVertexCoords(1, {x:1, y:2}));

// getNeighbours
assert.deepEqual(
	[0, 3, 4],
	new Graph(6).setEdge(0, 1).setEdge(0, 2).setEdge(1, 3).setEdge(3, 2).setEdge(4, 2).getNeighbours(2));

assert.deepEqual(
	[1, 2],
	new Graph(6).setEdge(0, 1).setEdge(0, 2).setEdge(1, 3).setEdge(3, 2).setEdge(4, 2).getNeighbours(0));

// getLevels
assert.deepEqual(
	[[0], [1, 2], [3, 4], [5]],
	new Graph(6).setEdge(0, 1).setEdge(0, 2).setEdge(1, 3).setEdge(3, 2).setEdge(4, 2).setEdge(4, 5).getLevels(0));

assert.throws(function () { new Graph(2).getLevels(0); }, function (error) { return error.message === 'The graph is not connected'; });

var mockGraph = new Graph(2);
mockGraph.isConnected = function() { return false; };
assert.throws(function () { mockGraph.setEdge(0, 1).getLevels(0); }, function (error) { return error.message === 'The graph is not connected'; });

// getVertexCircle
assert.equal(1, new Graph(2).setVertexCircle(1, 1).getVertexCircle(1));

// setVertexCircle
// todo:

// isConnected
assert.equal(false, new Graph(4).setEdge(0, 2).setEdge(2, 3).isConnected());

assert.equal(false, new Graph(2).isConnected());

assert.equal(true, new Graph(2).setEdge(0, 1).isConnected());

assert.equal(true, new Graph(3).setEdge(0, 1).setEdge(2, 1).isConnected());

assert.equal(true, new Graph(3).setEdge(0, 1).setEdge(2, 1).setEdge(2, 0).isConnected());

// getBridges
assert.throws(function () { new Graph(2).getBridges(); }, function (error) { return error.message === 'The graph is not connected'; });

assert.deepStrictEqual([[0, 1]], new Graph(2).setEdge(0, 1).getBridges());

assert.deepStrictEqual([[0, 1], [1, 2], [2, 3]], new Graph(4).setEdge(0, 1).setEdge(2, 3).setEdge(1, 2).getBridges());

assert.deepStrictEqual([], new Graph(4).setEdge(0, 1).setEdge(2, 3).setEdge(1, 2).setEdge(0, 3).getBridges());
