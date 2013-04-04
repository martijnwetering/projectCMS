var express = require('express');
var path = require('path');
var	project = require('./routes/projects'); 

var	login = require('./routes/login'); 

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'My secret'}));
    app.use(express.static(path.join(__dirname, 'public')));
});

var auth = express.basicAuth('admin', 'admin');

app.post('/cms/login', login.login);
app.get('/cms/logout', login.logout);

app.get('/cms/projects', project.findAll);
app.get('/cms/projects/:id', project.findById);
app.post('/cms/projects',login.checkAuth, project.addProject);
app.put('/cms/projects/:id',login.checkAuth, project.updateProject);
app.delete('/cms/projects/:id',login.checkAuth, project.deleteProject);


app.listen(3000);
console.log('Listening on port 3000...');


