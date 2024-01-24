
module.exports = (app) => {
  const projects = require("../controllers/project.controller.js");
  var router = require("express").Router();
  router.get("/", projects.findAll);
  router.post("/",projects.create);
  router.put("/:id",projects.update);
  router.delete("/:id",projects.delete);
  router.get("/:id", projects.findOne);
  app.use("/api/projects", router);
};
