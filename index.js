var Graph = require('./graph');
var toSvg = require('./graph-svg');
var fromXml = require('./graph-xml');
var assert = require('assert');
var fs = require('fs');
var path = require('path');

// fromXml
var testDirName = 'test-data';
fs.readdir(testDirName, function (err, files) {
	if (err) throw err;
	
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		if (path.extname(file) === '.xml') {
			
			fs.readFile(path.join(testDirName, file), 'utf8', function (err, xml) {
				if (err) throw err;
				
				fromXml(xml, function (err, graph) {
					if (err) throw err;
					
					fs.writeFile(graph.name + '.svg', toSvg(graph));
				});
			});
		}
	}
});
