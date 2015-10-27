var GraphXmlSerializer = require('./graph-xml');
var xmlSerializer = new GraphXmlSerializer();
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/graphs", function(err, db) {
	if (err) throw err;
	
	db.collection('graph').drop();

	var graphsFolder = "public\\graphs";
	fs.readdir(graphsFolder, function (err, files) {
		if (err) throw err;
		
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			
			if (path.extname(file) === '.graph') {
				
				fs.readFile(path.join(graphsFolder, file), 'utf8', function (err, xml) {
					if (err) throw err;
					
					xmlSerializer.deserialize(xml, function (err, graph) {
						if (err) throw err;
						
						var collection = db.collection('graph');
						collection.insert(graph);
					});
				});
			}
		}
	});
});
