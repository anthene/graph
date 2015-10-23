var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');
var GraphGenerator = require('./graph-gen');
var GraphXmlSerializer = require('./graph-xml');
var GraphSvgSerializer = require('./graph-svg');

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
	fs.readdir("public/graphs", function(err, files) {
		var i;
		var graphs = [];

		for (i = 0; i < files.length; i++) {
			if (path.extname(files[i]) === ".graph")
				graphs.push({
					name: files[i]//,
					//svg: fs.readFileSync(path.join("public/graphs", files[i]), "utf8")
				})
		}
		res.send(graphs);
	});
});

app.get("/genSvg", function(req, res) {
	var fileName = guid();
	var ser = new GraphXmlSerializer();
	var svgSer = new GraphSvgSerializer();

	ser.deserialize(fs.readFileSync(path.join("public/graphs", req.query.fileName), "utf8"),
		function (err, graph) {
			if (err) throw err;

			if (req.query.showBrigdes === 'true') {
				var brigdes = graph.getBridges();
				var i;

				for (i = 0; i < brigdes.length; i++) {
					graph.setEdge(brigdes[i][0], brigdes[i][1], {stroke: "red"});
				}
			}

			fs.writeFile('public/graphs/'+fileName+'.svg',
				svgSer.serialize(graph, {scale: +req.query.scale, color: req.query.color, radius: +req.query.radius }),
				function () {
					res.send('graphs/'+fileName+'.svg');
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