const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const logger = require("../logger");

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      res.send({ message: "User was registered successfully" });
    })
    .catch((err) => {
      logger.error(err);
      res.send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        const message = "User Not found.";
        logger.error(message);
        return res.status(404).send({ message: message });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        const message = "Invalid Password!";
        logger.error(message);
        return res.status(401).send({
          accessToken: null,
          message: message,
        });
      }

      const token = jwt.sign({ id: user.username }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });

      return res
        .status(200)
        .send({ message: "Login Successfully", accessToken: token });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};
