var express = require('express');
var path = require('path');

//mongoose
require( './db' );

var	project = require('./routes/projects'); 
var	login = require('./routes/login'); 

var app = express();


app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'My secret'}));
    app.all('/cms/*', login.checkAuth  );
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/cms', express.static(path.join(__dirname, 'private')));
    app.use(express.basicAuth('admin', 'admin'));
});

//var auth = express.basicAuth('admin', 'admin');

app.post('/login', login.login);
app.get('/cms/logout', login.logout);

app.get('/projects', project.findAll);
app.get('/projects/:id', project.findById);
app.post('/projects', login.checkAuth, project.addProject);
app.put('/projects/:id', login.checkAuth, project.updateProject);
app.delete('/projects/:id', login.checkAuth, project.deleteProject);


app.listen(3000);
console.log('Listening on port 3000...');


