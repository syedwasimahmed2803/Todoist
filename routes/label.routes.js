const {
  createLabelSchema,
  deleteLabelSchema,
} = require("../Validations/validations.js");
const validate = require("../middleware/validation.js");

module.exports = (app) => {
  const labels = require("../controllers/label.controller.js");
  var router = require("express").Router();
  router.get("/", labels.findAll);
  router.post("/", validate(createLabelSchema), labels.create);
  router.put("/:id", validate(deleteLabelSchema), labels.update);
  router.delete("/:id", labels.delete);
  router.get("/:id", labels.findOne);
  app.use("/api/labels", router);
};
