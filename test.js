var Graph = require('./graph');
var assert = require('assert');

// getVertexCount
assert.equal(3, new Graph(3).getVertexCount());

// getEdge
assert.equal(false, new Graph(3).getEdge(0, 2));

assert.throws(function () { new Graph(3).getEdge(3, 1); }, function (error) { return error == 'Incorrect i or j'; });

// setEdge
assert.equal(true, new Graph(3).setEdge(1, 2).getEdge(1, 2));

assert.throws(function () { new Graph(3).setEdge(1, 1); }, function (error) { return error == 'No loops'; });

assert.throws(function () { new Graph(3).setEdge(1, 4); }, function (error) { return error == 'Not good'; });



