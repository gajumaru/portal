
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    models = require('models');

var app = module.exports = express();

var setupRouting = function(routesDir) {
  var fs = require('fs'),
    files = fs.readdirSync(routesDir);
  files.forEach(function(e) {
    e = path.join(routesDir, e);
    var stats = fs.statSync(e);
    if (stats.isDirectory()) {
      setupRouting(e);
    } else {
      var urlPath = '/',
        handler,
        f;
      if (path.basename(e, '.js') == 'index') {
        urlPath += path.dirname(path.relative(routesDir, e));
      } else {
        urlPath += path.relative(routesDir, e).replace('.js', '');
      }
      urlPath = path.normalize(urlPath).replace('\\', '/');
      handler = require(e);
      for (f in handler) {
        switch(f) {
          case 'index':
            app.get(urlPath, handler[f]);
            break;
          case 'create':
            app.post(urlPath, handler[f]);
            break;
          case 'update':
            app.put(urlPath + '/:id', handler[f]);
            break;
          case 'login':
            app.post(urlPath, handler[f]);
            break;
          case 'destroy':
            app.del(urlPath + '/:id', handler[f]);
            break;
          default:
            app.get(urlPath + '/' + f, handler[f]);
        }
      }
    }
  });
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'your secret here'}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure(function() {
  // Login Check
  app.all('/', function(req, res, next) {
    if ('/login' != req.path && !req.session.userId) {
      res.redirect('/login');
      return;
    }
    next();
  });
});

// サービス起動前に全モデル定義を行う
models.defineAllModels(function(err) {
  if (err) {
    throw err;
  }
  setupRouting(path.resolve(path.join(__dirname, 'routes')));

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});
