var request = require('supertest'),
  app = require('../app');

var seedArticles = require('../db/articles.json');

 var agent = request.agent(app);

 describe('Homepage', function(){

 	it('Should response to get', function(done){
 		agent
      .get('/post')
      .expect(200)
      .expect(function(res){

        //to pass test return falsy value
        for(var i=0, l=seedArticles.length; i<l; i++) {
        	if(seedArticles[i].published === true) {
            if(res.text.indexOf('<h2><a href="/articles/'+ seedArticles[i].slug +'">'+seedArticles[i].title) === -1) {
              throw new Error("Not found");
              return;
            }
          }
        }
        return true;
      })
      .end(done);
 	});

 });
