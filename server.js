const express = require("express");
const cors = require("cors");
const logger = require("./logger/index.js");
const app = express();
app.use(express.json());
app.use(cors());
require("./routes/project.routes.js")(app);
require("./routes/task.routes.js")(app);
require("./routes/comment.routes.js")(app);
require("./routes/label.routes.js")(app);
require("./routes/auth.routes.js")(app);

const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    logger.error("Failed to sync db: " + err.message);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
