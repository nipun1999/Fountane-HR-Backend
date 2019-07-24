module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define('project', {
        

        projectKey: {
            type:DataTypes.STRING,
            allowNull : false
        },

        assigneeEmail: {
            type:DataTypes.STRING
        },

        reporterEmail: {
            type:DataTypes.STRING,
            allowNull : false
        },

        issueId : {
            type : DataTypes.BIGINT,
            allowNull : true,
            primaryKey: true
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
    return project;
};



 





    
