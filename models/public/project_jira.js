// module.exports = (sequelize, DataTypes) => {
//     const project_jira = sequelize.define('project_jira', {
        

//         projectKey: {
//             type:DataTypes.STRING,
//             primaryKey : true,
//             allowNull : false
//         },

//         projectName: {
//             type:DataTypes.STRING,
//             allowNull : false
//         },
        

//         created_at: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: new Date()
//         },
//     }, {
//             underscored: true
//         });

//     project_jira.addHook('afterCreate', 'postOnboarding', (permission, options) => {
//         console.log("Data to be written in redis here");
//     });
//     return project_jira;
// };




const Sequelize = require('sequelize')
const sequelize = new Sequelize('fountanehrdb', 'postgres', 'fountane', {
    host: 'localhost',
    dialect: 'postgres'
  });
const DataTypes = Sequelize
  const project_jira = sequelize.define('project_jira', {
        

    projectKey: {
        type:DataTypes.STRING,
        primaryKey : true,
        allowNull : false
    },

    projectName: {
        type:DataTypes.STRING,
        allowNull : false
    },
    

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
}, {
        underscored: true
    });
    project_jira.addHook('afterCreate', 'postOnboarding', (permission, options) => {
    console.log("Data to be written in redis here");
});

project_jira.sync({force:true})