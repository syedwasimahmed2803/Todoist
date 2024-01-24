module.exports = (app) => {
    const labels = require("../controllers/label.controller.js");
    var router = require("express").Router();
    router.get("/", labels.findAll);
    router.post("/",labels.create);
    router.put("/:id",labels.update);
    router.delete("/:id",labels.delete);
    router.get("/:id",labels.findOne);
    app.use("/api/labels", router);
  };
  