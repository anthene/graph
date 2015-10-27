var Graph = require('./graph');
var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');
var GraphGenerator = require('./graph-gen');
var GraphXmlSerializer = require('./graph-xml');
var GraphSvgSerializer = require('./graph-svg');
var mongoClient = require('mongodb').MongoClient;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/graphs", function(req, res) {
	mongoClient.connect("mongodb://localhost:27017/graphs", function(err, db) {
		if (err) throw err;
		
		db.collection('graph').find({}, {name:1, _id:0}).toArray(function(err, items) {
			if (err) throw err;
		
			res.send(items);
		});
	});
});

app.get("/genSvg", function(req, res) {
	var fileName = guid();
	var svgSer = new GraphSvgSerializer();

	mongoClient.connect("mongodb://localhost:27017/graphs", function(err, db) {
		if (err) throw err;
		
		db.collection('graph').findOne({ name: req.query.fileName }, { _id: 0 }, function(err, graph) {
			if (err) throw err;
			
			var gr = new Graph(graph.edges.length, graph.name, graph);
			
			if (req.query.showBrigdes === 'true') {
				var brigdes = gr.getBridges();
				var i;

				for (i = 0; i < brigdes.length; i++) {
					gr.setEdge(brigdes[i][0], brigdes[i][1], {stroke: "red"});
				}
			}
			
			var svg = svgSer.serialize(gr, {scale: +req.query.scale, color: req.query.color, radius: +req.query.radius });
			
			fs.writeFile('public/graphs/'+fileName+'.svg',
				svg,
				function (err, f){
					res.send('graphs/'+fileName+'.svg');
				});
		});
	});
});

app.get("/petGenerate", function(req, res) {
	var fileName = guid();
	var gen = new GraphGenerator();
	var svgSer = new GraphSvgSerializer();

	fs.writeFile('public/graphs/'+fileName+'.svg',
		svgSer.serialize(gen.petGenerate(+req.query.vertexCount, +req.query.step), {scale: 3, color: "black", radius: 1 }),
			function () {
			res.send('graphs/'+fileName+'.svg');
		});
});

app.listen(3000);
console.log('Server started (3000 port)...')