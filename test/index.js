var request = require('supertest'),
  app = require('../app');

var seedArticles = require('../db/articles.json');

 var agent = request.agent(app);

 describe('Homepage', function(){

 	it('Should response to get', function(done){
 		agent
      .get('/')
      .expect(200)
      .expect(function(res){

      	console.log(res.body);
      	console.log(res.text);

        //to pass test return falsy value
        var pass = false;
        for(var i=0, l=seedArticles.length; i<l; i++) {
        	console.log(i);
        }
      })
      .end(done);
 	});

 });