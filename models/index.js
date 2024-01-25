const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.project = require("./project.model.js")(sequelize, Sequelize);
db.task = require("./task.model.js")(sequelize, Sequelize);
db.comment = require("./comment.model.js")(sequelize, Sequelize);
db.label = require("./label.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
const Project = require("./project.model.js")(sequelize, Sequelize);
const Task = require("./task.model.js")(sequelize, Sequelize);
const Comment = require("./comment.model.js")(sequelize, Sequelize);
const Label = require("./label.model.js")(sequelize, Sequelize);
const User = require("./user.model.js")(sequelize, Sequelize);

User.hasMany(Project, { foreignKey: "username" });
Project.belongsTo(User, { foreignKey: "username" });
User.hasMany(Task, { foreignKey: "username" });
Task.belongsTo(User, { foreignKey: "username" });
User.hasMany(Comment, { foreignKey: "username" });
Comment.belongsTo(User, { foreignKey: "username" });
User.hasMany(Label, { foreignKey: "username" });
Label.belongsTo(User, { foreignKey: "username" });
Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });
Task.hasMany(Comment, { foreignKey: "task_id" });
Comment.belongsTo(Task, { foreignKey: "task_id" });
Project.hasMany(Comment, { foreignKey: "project_id" });
Comment.belongsTo(Project, { foreignKey: "project_id" });

module.exports = {
  Project,
  Task,
  Comment,
  Label,
  User,
};

module.exports = db;
