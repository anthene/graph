var Graph = require('./graph');
var toSvg = require('./graph-svg');
var assert = require('assert');
var fs = require('fs');

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
fs.writeFile('graph.svg', toSvg(new Graph(4).setEdge(0, 1).setEdge(1, 2).setEdge(3, 1).setEdge(2, 3).setEdge(0, 3)));

