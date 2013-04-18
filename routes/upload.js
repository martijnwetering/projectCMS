var fs = require('fs');

exports.saveImage = function(req, res) {
	fs.readFile(req.files.file.path, function (err, data) {
	  // ...
	  var newPath = "./private/uploads/" + req.files.file.name;
	  fs.writeFile(newPath, data, function (err) {
	    if(err){
	    	console.log("error with uploading:", err);
	    } else {
	    	res.redirect("back");
	    }
	  });
	});
}

exports.deleteImage = function(req, res) {
	
	console.log("Deleting image", req.body.imageName);
	var filePath = "./private/uploads/" +  req.body.imageName;
	if (fs.existsSync(filePath)) { // or fs.existsSync
    	fs.unlink(filePath, function(err) {
			if(err){
				console.log("error with deleting:", err);
				res.end();
			} else {
				console.log("succesfull deleted");
				res.set({'Content-Type': 'text/plain'});
				res.send("succesfull deleted");	
			}
		});	
	} else {
		console.log("file does not exists");
		res.end();
	}
}


