module.exports = (sequelize, DataTypes) => {
    const project_jira = sequelize.define('project_jira', {
        

        projectID: {
            type:DataTypes.BIGINT,
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
    return project_jira;
};
