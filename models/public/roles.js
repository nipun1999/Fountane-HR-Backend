
module.exports = (sequelize, DataTypes) => {
    const rolesObj = sequelize.define('roles', {
        
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        name: { type:DataTypes.STRING },
        orgId: { type:DataTypes.BIGINT },

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

        rolesObj.addHook('afterCreate', 'preOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return rolesObj;
};

/**
 * Cache architecture:
 *      userId_entityName_role : [entityId]
 *      userId_entityName_entityId_role : true // New design
 */
