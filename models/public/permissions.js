var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const permissions = sequelize.define('permissions', {
        
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        action: { type:DataTypes.STRING },
        // In case the user dosent exist
        entity: { type:DataTypes.STRING },
        entityId: { type:DataTypes.BIGINT },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE
    }, {
            underscored: true
        });

    permissions.addHook('afterCreate', 'preOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return permissions;
};

/**
 * Cache architecture:
 *      userId_entityName_role : [entityId]
 *      userId_entityName_entityId_role : true // New design
 */
