const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

module.exports = {
  server: {
    environment: process.env.environment,
    port: process.env.port || 3000
  },
  database: {
    uri: process.env.mongoose_url,
    database_name: process.env.database_name
  },
  logger: {
    file_name: process.env.environment
  }
}