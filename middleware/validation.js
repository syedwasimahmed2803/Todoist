const logger = require("../logger");

const validation = (schema) => async (req, res, next) => {
  const body = req.body;

  try {
    await schema.validate(body);
    return next();
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({ error });
  }
};

module.exports = validation;
