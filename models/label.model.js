module.exports = (sequelize, Sequelize) => {
    const Label = sequelize.define("label", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique:true,
      },
      color: {
        type: Sequelize.STRING,
      },
      order: {
        type: Sequelize.INTEGER,
      },
      is_favorite: {
        type: Sequelize.BOOLEAN,
      },
      username: {
        type: Sequelize.STRING,
        allowNull:false,
        references: {
          model: 'users', // This should match the name of the Project model
          key: 'username',
        },},
    });  
    return Label;
  };
  