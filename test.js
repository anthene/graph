var Graph = require('./graph');
var toSvg = require('./graph-svg').toSvg;
var toLeveledSvg = require('./graph-svg').toLeveledSvg;
var fromXml = require('./graph-xml');
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var testResultDir = 'test-results';
fs.mkdirSync(testResultDir);

// getVertexCount
assert.equal(3, new Graph(3).getVertexCount());

// getEdge
assert.equal(false, new Graph(3).getEdge(0, 2));

assert.throws(function () { new Graph(3).getEdge(3, 1); }, function (error) { return error == 'Incorrect i or j'; });

// setEdge
assert.equal(true, new Graph(3).setEdge(1, 2).getEdge(1, 2));

assert.throws(function () { new Graph(3).setEdge(1, 1); }, function (error) { return error == 'No loops'; });

assert.throws(function () { new Graph(3).setEdge(1, 4); }, function (error) { return error == 'Not good'; });

// forEachVertex
var num = 0;
var action = function () { num++; };
new Graph(3).forEachVertex(action);
assert.equal(3, num);

// forEachEdge
var num = 0;
var action = function () { num++; };
new Graph(4).setEdge(0, 1).setEdge(1, 2).setEdge(3, 1).setEdge(2, 3).forEachEdge(action);
assert.equal(4, num);

// toSvg
fs.writeFile(path.join(testResultDir, 'graph.svg'), toSvg(new Graph(4).setEdge(0, 1).setEdge(1, 2).setEdge(3, 1).setEdge(2, 3).setEdge(0, 3)));

// getVertex
var testDirName = 'test-data'
fs.readFile(path.join(testDirName, 'k2.xml'), 'utf8', function (err, xml) {
	if (err) throw err;
	
	fromXml(xml, function (err, graph) {
		if (err) throw err;
		
		assert.deepEqual({ x:10, y:10 }, graph.getVertex(0));
		assert.deepEqual({ x:90, y:90 }, graph.getVertex(1));
	});
});

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
