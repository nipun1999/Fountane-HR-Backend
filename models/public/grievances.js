
module.exports = (sequelize, DataTypes) => {
    const grievance = sequelize.define('grievance', {
        
        grievanceId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        empCode: { type:DataTypes.STRING,allowNull: false },

        description: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },

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

    grievance.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return grievance;
};
