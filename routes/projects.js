var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var dbHost = "127.0.0.1";
var dbPort = mongo.Connection.DEFAULT_PORT;

var server = new Server(dbHost, dbPort, { });
var db = new Db('projectdb', server, {safe: true});



db.open(function(err, db){
	if(!err) {
		console.log("connected to project database");

		db.collection('projects', {safe:true}, function(err, collection) {
			//not working 
			if(err) {
				console.log("The database doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.findAll = function(req, res) {
	db.collection('projects', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
}

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving project: ' + id);
	db.collection('projects', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
}

exports.addProject = function(req, res) {
	var project = req.body;
	console.log('Adding project: ' + JSON.stringify(project));
	db.collection('projects', function(err, collection) {
		collection.insert(project, {safe:true}, function(err, result) {
			if(err) {
				res.send({'error': 'An error has occured'});
			} else {
				console.log('Sucees: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateProject = function(req, res) {
	var id = req.params.id;
	var project = req.body;
	delete project._id;
	console.log('Updating project: ' + id);
	console.log(JSON.stringify(project));
	db.collection('projects', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id) }, project, {safe:true}, function(err, result) {
			if(err) {
				console.log("Error updating project: " + err);
				result.send({'error': 'An error occured'});
			} else {
				console.log(' ' + result + ' document(s) updated');
				res.send(project);
			}
		});
	});
}

exports.deleteProject = function(req, res) {
	var id = req.params.id;
	console.log("Deleting project: " + id);
	db.collection('projects', function (err, collection) {
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if(err) {
				res.send({'error': 'An error has occurred - ' + err });
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});

}

populateDB = function() {
 
    var projects = [
    {
        name: 			"naam1",
        year: 			"2009",
        client: 		"opdrachtgever1",
        context: 		"de context",
        instruction: 	"opdracht instructie",
        expertise: 		"wat gedaan",
        description: 	"opdrachtopmschrijving",
        picture: 		"afbeelding1.jpg"
    }];
 
    db.collection('projects', function(err, collection) {
        collection.insert(projects, {safe:true}, function(err, result) {
        	if(err) {
        		console.log("something failed");
        	}
        });
    });
 
};



