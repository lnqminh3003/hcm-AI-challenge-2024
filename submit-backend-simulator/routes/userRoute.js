const user_controller = require('../controllers/users');

module.exports = (app) => {
  app.route('/add-user-to-query').post(user_controller.addUserToQuery)
}
