
var mongoose = require( 'mongoose' );
var Projects = mongoose.model( 'Project' );
var BSON = mongoose.mongo.BSONPure;

exports.findAll = function( request, respond ) {
	Projects.find({}, function( err, projects) {
		respond.send(projects);
	});
}

exports.findById = function( req, res ) {
	var id = req.params.id;
	console.log('Retrieving project: ' + id);
	Projects.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
		res.send(item);
	});
}

exports.addProject = function(req, res) {
	var project = req.body;
	console.log('Adding project: ' + JSON.stringify(project));
	Projects.collection.insert(project, {safe:true}, function(err, result) {
		if(err) {
				res.send({'error': 'An error has occured'});
			} else {
				console.log('Sucees: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
	});
}

exports.updateProject = function( req, res) {
	var id = req.params.id;
	var project = req.body;
	delete project._id;
	console.log('Updating project: ' + id);
	console.log(JSON.stringify(project));
	Projects.update({'_id':new BSON.ObjectID(id) }, project, {safe:true}, function(err, result) {
		if(err) {
			console.log("Error updating project: " + err);
			res.send({'error': 'An error occured'});
		} else {
			console.log(' ' + result + ' document(s) updated');
			res.send(project);
		}
	});	
}

exports.deleteProject = function(req, res) {
	var id = req.params.id;
	console.log("Deleting project: " + id);
	Projects.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
		if(err) {
			res.send({'error': 'An error has occurred - ' + err });
		} else {
			console.log('' + result + ' document(s) deleted');
			res.send(req.body);
		}
		////todo, end request in remove function
		res.end();
	});
	res.end();
}

