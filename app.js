var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongoskin = require('mongoskin'),
	dbUrl = process.env.MOGOHQ_URL || 'mongodb://@localhost:27017/blog',
	db = mongoskin.db(dbUrl, {safe:true}),
	collections = {
		articles: db.collection('articles'),
		users: db.collection('users')
	};

var session = require('express-session'),
	logger = require('morgan'),
	errorHandler = require('errorHandler'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

var app = express();

//config
app.set('appName', 'blog-express');
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middlewares
app.use(function(req, res, next){
	if(!collections.articles || !collections.users) return next(new Error('No Collections'));
	req.collections = collections;
	return next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));




/* session */
app.use(cookieParser('333-444-555'));
app.use(session({
	secret:'my-cool-secret',
	name:'test-blog'
}));

//Authetication middleware
app.use(function(req, res, next){
	if(req.session && req.session.admin) {
		res.locals.admin = true;
	}
	next();
});

//Authorization middleware
var authorize = function(req, res, next){
	if(req.session && req.session.admin) {
		return next();
	} else {
		return res.send(401);
	}
};



if('development' == app.get('env')) app.use(errorHandler());





//Pages Routes
var routes = {};
routes.user = require('./routes/users');
routes.article = require('./routes/articles');

app.get('/', routes.article.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize, routes.article.admin);
app.get('/post', authorize, routes.article.post);
app.post('/post', authorize, routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

//REST API Routes
app.all('/api', authorize);
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);


//404
app.all('*', function(req, res){
	res.status(404).json({message:'Not Found'});
});



//init server
http.createServer(app)
	.listen(app.get('port'), function(){
		console.log('Server running on port: '+app.get('port'));
	});

//export app
module.exports = app;
