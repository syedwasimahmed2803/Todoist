const { createCommentSchema } = require("../Validations/validations.js");
const validate = require("../middleware/validation.js");

module.exports = (app) => {
  const comments = require("../controllers/comment.controller.js");
  var router = require("express").Router();
  router.get("/", comments.findAll);
  router.post("/", validate(createCommentSchema), comments.create);
  router.put("/:id", comments.update);
  router.delete("/:id", comments.delete);
  router.get("/:id", comments.findOne);
  app.use("/api/comments", router);
};
