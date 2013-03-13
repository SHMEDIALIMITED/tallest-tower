var fs = require('fs');
module.exports = {
    development: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Mega Structures Dev'
      },
      db: 'mongodb://localhost/tallest_tower_dev',
      facebook: {
          clientID: "351418368295988"
        , clientSecret: "a5a572f8cbca84075fbeeec6a65e1657"
        , callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      
    }
  , production: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Mega Structures'
      },
      db: process.env.MONGOLAB_URI,
      facebook: {
          clientID: process.env.FACEBOOK_APP_ID
        , clientSecret: process.env.FACEBOOK_SECRET
      },

    }
}