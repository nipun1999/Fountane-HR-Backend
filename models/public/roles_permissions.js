
module.exports = (sequelize, DataTypes) => {
    const rpObj = sequelize.define('roles_permissions', {
        
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
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

        rpObj.addHook('afterCreate', 'preOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return rpObj;
};

/**
 * Cache architecture:
 *      userId_entityName_role : [entityId]
 *      userId_entityName_entityId_role : true // New design
 */
