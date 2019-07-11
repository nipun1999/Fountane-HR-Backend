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

  const project = sequelize.define('projects',{
                projectID: {
                    type:Sequelize.BIGINT,
                    allowNull : false
                },
        
                fountaneEmail: {
                    type:Sequelize.STRING,
                    allowNull : false
                },
        
                issueId : {
                    type : Sequelize.BIGINT,
                    allowNull : true
                },
        
                issueName : {
                    type : Sequelize.STRING,
                    allowNull : true
                },
        
                status : {
                    type : Sequelize.STRING,
                    allowNull : true
                },
        
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: new Date()
                },
            }, {
                    underscored: true
                });
        
project.addHook('afterCreate', 'postOnboarding', (permission, options) => {
                console.log("Data to be written in redis here");
});


project.sync({force:true}).then(() => {
    console.log('Created')
})