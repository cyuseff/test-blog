exports.show = function(req, res, next){
  if(!req.params.slug) return next(new Error('No article slug.'));
  req.collections.articles.findOne({slug:req.params.slug}, function(err, article){
    if(err) return next(err);
    if(!article.published) return res.send(401);
    res.render('article', article);
  });
};

exports.index = function(req, res, next){
  req.collections.articles.find({published:true}).toArray(function(err, articles){
    if(err) return next(err);
    res.render('index', {articles:articles});
  });
};

exports.post = function(req, res, next){
  req.collections.articles.find().toArray(function(err, articles){
    if(err) return next(err);
    res.render('post');
  });
};

exports.list = function(req, res, next){
  req.collections.articles.find().toArray(function(err, articles){
    if(err) return next(err);
    res.send({articles:articles});
  });
};

exports.add = function(req, res, next){
  if(!req.body.article) return next(new Error('No article payload.'));
  var article = req.body.article;
  article.published = false;
  req.collections.articles.insert(article, function(err, articleResponse){
    if(err) return next(err);
    res.send(articleResponse);
  });
};

exports.edit = function(req, res, next){
  if(!req.params.id) return next(new Error('No article ID.'));
  req.collections.articles.updateById(req.params.id, {$set:req.body.article}, function(err, count){
    if(err) return next(err);
    res.send({affectedCount:count});
  });
};

exports.del = function(req, res, next){
  if(!req.params.id) return next(new Error('No article ID.'));
  req.collections.articles.removeById(req.params.id, function(err, count){
    if(err) return next(err);
    res.send({affectedCount:count});
  });
};


exports.postArticle = function(req, res, next){
  if(!req.body.title || !req.body.slug || !req.body.text) {
    return res.render('post', {error:'Fill title, slug and text.'});
  }

  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    published: false
  };

  req.collections.articles.insert(article, function(err, articleResponse){
    if(err) return next(err);
    res.render('post', {error: 'Article was added. Publish it on Admin page.'});
  });
};


exports.admin = function(req, res, next){
  req.collections.articles.find({}, {sort:{_id:-1}}).toArray(function(err, articles){
    if(err) return next(err);
    res.render('admin', {articles:articles});
  });
};
