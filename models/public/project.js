
// module.exports = (sequelize, DataTypes) => {
//     const project = sequelize.define('project', {
        

//         projectKey: {
//             type:DataTypes.STRING,
//             allowNull : false
//         },

//         fountaneEmail: {
//             type:DataTypes.STRING,
//             allowNull : false
//         },

//         issueId : {
//             type : DataTypes.BIGINT,
//             allowNull : true
//         },

//         issueName : {
//             type : DataTypes.STRING,
//             allowNull : true
//         },

//         status : {
//             type : DataTypes.STRING,
//             allowNull : true
//         },

//         created_at: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: new Date()
//         },
//     }, {
//             underscored: true
//         });

//     project.addHook('afterCreate', 'postOnboarding', (permission, options) => {
//         console.log("Data to be written in redis here");
//     });
//     return project;
// };


const Sequelize = require('sequelize')
const sequelize = new Sequelize('fountanehrdb', 'postgres', 'fountane', {
    host: 'localhost',
    dialect: 'postgres'
  });
const DataTypes = Sequelize
  const project = sequelize.define('project', {
        

    projectKey: {
        type:DataTypes.STRING,
        allowNull : false
    },

    fountaneEmail: {
        type:DataTypes.STRING,
        allowNull : false
    },

    issueId : {
        type : DataTypes.BIGINT,
        allowNull : true
    },

    issueName : {
        type : DataTypes.STRING,
        allowNull : true
    },

    status : {
        type : DataTypes.STRING,
        allowNull : true
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
}, {
        underscored: true
    });

project.addHook('afterCreate', 'postOnboarding', (permission, options) => {
    console.log("Data to be written in redis here");
});

project.sync({force:true})

 