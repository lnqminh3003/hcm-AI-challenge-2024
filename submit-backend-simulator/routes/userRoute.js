const user_controller = require('../controllers/users');

module.exports = (app) => {
  app.route('/users').get(user_controller.list_user),
  app.route('/users/:userId').get(user_controller.get_user),
  app.route('/users').post(user_controller.create_user),
  app.route('/users/:userId').put(user_controller.update_user),
  app.route('/users/:userId').put(user_controller.delete_user)
}
