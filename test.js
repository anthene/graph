var Graph = require('./graph');
var toSvg = require('./graph-svg').toSvg;
var toLeveledSvg = require('./graph-svg').toLeveledSvg;
var fromXml = require('./graph-xml');
var assert = require('assert');
var fs = require('fs');
var path = require('path');

/*
var testResultDir = 'test-results';
if (!fs.existsSync(testResultDir))
	fs.mkdirSync(testResultDir);
*/
	
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
/*
var testDirName = 'test-data'
fs.readFile(path.join(testDirName, 'k2.xml'), 'utf8', function (err, xml) {
	if (err) throw err;
	
	fromXml(xml, function (err, graph) {
		if (err) throw err;
		
		assert.deepEqual({ x:10, y:10 }, graph.getVertex(0));
		assert.deepEqual({ x:90, y:90 }, graph.getVertex(1));
	});
});
*/

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

/*
// toSvg
fs.writeFile(path.join(testResultDir, 'graph.svg'), toSvg(new Graph(4).setEdge(0, 1).setEdge(1, 2).setEdge(3, 1).setEdge(2, 3).setEdge(0, 3)));

// toLeveledSvg
fs.writeFile(path.join(testResultDir, 'levs0.svg'), toLeveledSvg(new Graph(6, 'levs').setEdge(0, 1).setEdge(0, 2).setEdge(1, 3).setEdge(3, 2).setEdge(4, 2).setEdge(4, 5), 0));

fs.writeFile(path.join(testResultDir, 'levs5.svg'), toLeveledSvg(new Graph(6, 'levs').setEdge(0, 1).setEdge(0, 2).setEdge(1, 3).setEdge(3, 2).setEdge(4, 2).setEdge(4, 5), 5));

fs.readFile(path.join(testDirName, 'k3,3.xml'), 'utf8', function (err, xml) {
	if (err) throw err;
	
	fromXml(xml, function (err, graph) {
		if (err) throw err;
		
		fs.writeFile(path.join(testResultDir, 'k3,3_levs.svg'), toLeveledSvg(graph, 0));
	});
});
*/

/*
fs.readFile(path.join(testDirName, 'petersen.xml'), 'utf8', function (err, xml) {
	if (err) throw err;
	
	fromXml(xml, function (err, graph) {
		if (err) throw err;
		
		assert.equal(1, graph.getVertexCircle(2));
		assert.equal(0, graph.getVertexCircle(5));
	});
});
*/
