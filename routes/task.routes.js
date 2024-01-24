module.exports = (app) => {
  const tasks = require("../controllers/task.controller.js");
  var router = require("express").Router();
  router.get("/", tasks.findAll);
  router.post("/", tasks.create);
  router.put("/:id", tasks.update);
  router.delete("/:id", tasks.delete);
  router.get("/:id", tasks.findOne);
  router.put("/toggle/:id", tasks.toggle);
  app.use("/api/task", router);
};
