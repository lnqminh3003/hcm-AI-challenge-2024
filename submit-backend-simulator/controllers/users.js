const User = require("../models/resultModel");

const list_user = (req, res) => {
  User.find({})
    .select("username")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(400).send(err.errors);
    });
};

const get_user = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(400).send(err.errors);
    });
};

const create_user = (req, res) => {
  const newUser = new User(req.body);

  newUser.save((err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newUser);
  });
};

const update_user = (req, res) => {};

const delete_user = (req, res) => {
  User.findByIdAndRemove(req.params.userId, (err, data) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "User successfully deleted",
    };
    return res.status(200).send(response);
  });
};

module.exports = {
  list_user,
  get_user,
  create_user,
  delete_user,
  update_user,
};
