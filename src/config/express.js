
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , viewHelpers = require('./middlewares/view')

module.exports = function (app, config) {



  app.set('showStackError', true)
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      console.log(res.getHeader('Content-Type'));
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))

  app.use(express.static(config.root + '/public'))
  app.use(express.logger('dev'))

  // set views path, template engine and default layout
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/public');
  app.engine('html', require('ejs').renderFile);

  app.configure(function () {
    // dynamic helpers
    app.use(express.favicon())
    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    // express/mongo session storage
    app.use(express.session({
      secret: 'noobjs',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    

    

    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl })
    })

  })
}