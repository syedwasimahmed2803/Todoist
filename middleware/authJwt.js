const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const logger = require("../logger/index.js");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  const message = "No token provided";
  if (!token) {
    logger.warn(message);
    return res.status(403).send({
      message: message,
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    const message = "Unauthorized!";
    if (err) {
      logger.warn(message);
      return res.status(401).send({
        message: message,
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
