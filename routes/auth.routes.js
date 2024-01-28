const { verifySignUp } = require("../middleware");
const { signupSchema, signinSchema } = require("../Validations/validations.js");
const validate = require("../middleware/validation.js");

const controller = require("../controllers/auth.controller.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    validate(signupSchema),
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/signin", validate(signinSchema), controller.signin);
};
