/*global require,console,__dirname*/
'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var jimp = require('jimp');

app.get('/', function (req, res) {
	var fileName = req.query.name;
	var folder = req.query.folder;
	var result;
	var filePath = folder + '/' + fileName;

	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}

	if (!fs.existsSync(filePath)) {
		new jimp(fileName, function() {
			var width = parseInt(req.query.w, 10);
			var height = parseInt(req.query.h, 10);

			switch(req.query.fn) {
				case 'resize':
					result = this.resize(width, height);
					break;
			}
			
			result.write(folder + '/' + fileName, function () {
				res.send('<img src="' + filePath + '"/>');
			});
			
		});
	} else {
		res.send('<img src="' + filePath + '"/>');
	}
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname));