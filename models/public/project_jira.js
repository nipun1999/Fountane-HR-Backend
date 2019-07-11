const Sequelize = require('sequelize');
const sequelize = new Sequelize('fountanehrdb', 'fountane', 'Co0kies!', {
    host: 'localhost',
    dialect: 'postgres'
  });

  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const project_jira = sequelize.define('project_jira', {
        

    projectID: {
        type:Sequelize.BIGINT,
        primaryKey : true,
        allowNull : false
    },

    projectName: {
        type:Sequelize.STRING,
        allowNull : false
    },
    

    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
}, {
        underscored: true
    });

project_jira.addHook('afterCreate', 'postOnboarding', (permission, options) => {
    console.log("Data to be written in redis here");
});

project_jira.sync({force:true}).then(() => {
    console.log('Created')
})