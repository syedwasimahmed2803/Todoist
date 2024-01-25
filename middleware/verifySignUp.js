const db = require("../models");
const logger = require("../logger/index");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      const message = "Failed! Username is already in use!";
      res.status(400).send({
        message: message,
      });
      logger.warn(message);
      return;
    }
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        const message = "Failed! Email is already in use";
        res.status(400).send({
          message: message,
        });
        logger.warn(message);
        return;
      }
      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
