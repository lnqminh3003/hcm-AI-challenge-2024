const user_controller = require('../controllers/users');

module.exports = (app) => {
  app.route('/add-user-to-query').post(user_controller.addUserToQuery)
  app.route('/get-users-by-query/:queryName').get(user_controller.getUsersByQuery);
}
