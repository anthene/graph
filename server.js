var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');
var GraphGenerator = require('./graph-gen');
var toSvg = require('./graph-svg').toSvg;

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
			graphs.push({
				name: files[i]//,
				//svg: fs.readFileSync(path.join("public/graphs", files[i]), "utf8")
			})
		}
		res.send(graphs);
	});
});

app.get("/petGenerate", function(req, res) {
	var fileName = guid();
	var gen = new GraphGenerator();
	fs.writeFile('public/graphs/'+fileName+'.svg', toSvg(gen.petGenerate(+req.query.vertexCount, +req.query.step)), function () {
		res.send('graphs/'+fileName+'.svg');
	});
});

app.listen(3000);
console.log('Server started (3000 port)...')