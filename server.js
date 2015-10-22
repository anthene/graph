var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');

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

app.listen(3000);
console.log('Server started (3000 port)...')