module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    project_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
    },
    section_id: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    is_completed: {
      type: Sequelize.BOOLEAN,
    },
    labels: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    parent_id: {
      type: Sequelize.STRING,
    },
    order: {
      type: Sequelize.INTEGER,
    },
    priority: {
      type: Sequelize.INTEGER,
    },
    due: {
      type: Sequelize.JSONB,
    },
    url: {
      type: Sequelize.STRING,
    },
    comment_count: {
      type: Sequelize.INTEGER,
    },
    created_at: {
      type: Sequelize.STRING,
    },
    creator_id: {
      type: Sequelize.STRING,
    },
    assignee_id: {
      type: Sequelize.STRING,
    },
    assigner_id: {
      type: Sequelize.STRING,
    },
    duration: {
      type: Sequelize.JSONB,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "users", // This should match the name of the Project model
        key: "username",
      },
    },
  });
  return Task;
};
