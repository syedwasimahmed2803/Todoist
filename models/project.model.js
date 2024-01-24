module.exports= (sequelize, Sequelize) => {
  const Project = sequelize.define("project", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    comment_count: {
      type: Sequelize.INTEGER,
    },
    order: {
      type: Sequelize.INTEGER,
    },
    color: {
      type: Sequelize.STRING,
    },
    is_shared: {
      type: Sequelize.BOOLEAN,
    },
    is_favorite: {
      type: Sequelize.BOOLEAN,
    },
    is_inbox_project: {
      type: Sequelize.BOOLEAN,
    },
    is_team_inbox: {
      type: Sequelize.BOOLEAN,
    },
    view_style: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    parent_id: {
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
      allowNull:false,
      references: {
        model: 'users', // This should match the name of the Project model
        key: 'username',
      },},
  });
  return Project;
};
