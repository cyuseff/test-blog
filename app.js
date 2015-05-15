var express = require('express'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser');

var app = express();

//config
app.set('appName', 'Hello Wolrd');
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middlewares
app.use(bodyParser.urlencoded({extended:true}));


//routes
app.all('*', function(req, res){
	//res.status(200).send('oli');
	res.render('index', {message:'Welcome to the Practical Node!'});
});

//init server
http.createServer(app)
	.listen(app.get('port'), function(){
		console.log('Server running on port: '+app.get('port'));
	});

//export app
module.exports = app;