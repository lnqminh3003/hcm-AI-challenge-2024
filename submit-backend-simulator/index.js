const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const app = express();

// run server
app.listen(config.server.port, (err) => {
  if(err) {
    process.exit(1);
  }
  require('./lib/database');  

  fs.readdirSync(path.join(__dirname, './routes')).map(file => {
		require('./routes/' + file)(app);
  });

  app._router.stack.forEach(function(r){
    if (r.route && r.route.path && r.route.stack.method){
      console.log(r.route.stack.method + "    " + r.route.path)
    }
  })
});

module.exports = app;
