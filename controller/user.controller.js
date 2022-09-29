const User = require("../model/User");

exports.createUser = (req, res, next) => {
  const username = req.params.username;

  if (!username) {
    const error = new Error("Username is required to create a new user.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  User.findOne({ username: username })
    .then((result) => {
      if (result) {
        const error = new Error("Username already exists.");
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      const newUser = new User({
        username: username,
      });

      return newUser.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error("An error occured");
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ msg: "User created successfully!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const username = req.params.username;

  if (!username) {
    const error = new Error("Username is required to login.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  User.findOne({ username: username })
    .then((result) => {
      console.log(result);
      if (!result) {
        const error = new Error(
          "No matching users found related to this username."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
