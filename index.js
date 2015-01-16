/*global require,console,__dirname*/
'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var jimp = require('jimp');
var ExifImage = require('exif').ExifImage;
var multer  = require('multer');

var imageware = function (req, res) {
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
				res.sendFile(filePath, {root: __dirname});
			});
			
		});
	} else {
		res.sendFile(filePath, {root: __dirname});
	}
};

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname));
app.use('/photo', imageware);

app.post('/api/photo', multer(
{ 
    dest: './uploads', 
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path + 'size ' + file.buffer.length);
	    new ExifImage({ image : file.buffer }, function (error, exifData) {
	        if (error)
	            console.log('Error: '+error.message);
	        else {
	            console.log(exifData); 
	            new jimp(file.buffer, function() { 
		            // EK: refer to EXIF_Orientations.jpg 
		            // (taken from http://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/)
	            	var result = fixOrientation(this, exifData.image.Orientation);
	            	result.write('./uploads/' + file.originalname);
	            });
	        }
	    });
    },
    inMemory: true
}));

app.post('/api/photo', function (req, res, next) {
	res.send(req.files.file.originalname);
	next();
});

function fixOrientation(jimpImage, orientation) {
	
	switch (orientation) {
		case 1:
			return jimpImage;
		case 2:
			return jimpImage.horizontalFlip();
	    case 3:
	        return jimpImage.horizontalFlip().verticalFlip();
	    case 4:
	        return jimpImage.verticalFlip();
	    case 5:
	        return jimpImage.rotateCW().horizontalFlip();
	    case 6:
	        return jimpImage.rotateCW();
	    case 7:
	        return jimpImage.horizontalFlip().rotateCW();
	    case 8:
	        return jimpImage.rotateCW().horizontalFlip().verticalFlip();
    }
}