var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;


var Project = new Schema({
	name: 			String,
    year: 			Number,
    client: 		String,
    context: 		String,
    instruction: 	String,
    expertise: 		String,
    description: 	String,
    picture: 		String
});

mongoose.model( 'Project', Project );
mongoose.connect( 'mongodb://localhost/projectdb' );

var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:' ));
db.once( 'open', function callback () {
	//connected
	console.log( "connected to the project database" );
});