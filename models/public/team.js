
module.exports = (sequelize, DataTypes) => {
    const team = sequelize.define('team', {
        

        empCode: {
            type:DataTypes.STRING,
        },

        TLempCode: {
            type:DataTypes.STRING,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE
    }, {
            underscored: true
        });

    team.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return team;
};
