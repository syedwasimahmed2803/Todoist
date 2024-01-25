module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    task_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "tasks",
        key: "id",
      },
    },
    project_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
    },
    posted_at: {
      type: Sequelize.DATE,
    },
    content: {
      type: Sequelize.STRING,
    },
    attachment: {
      type: Sequelize.JSONB,
      defaultValue: null,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "username",
      },
    },
  });

  return Comment;
};
