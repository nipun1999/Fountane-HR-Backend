
module.exports = (sequelize, DataTypes) => {
    const events = sequelize.define('events', {
        
        eventId : {
            type : DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement : true
        },

        empCode: {
            type:DataTypes.STRING,
            allowNull : false
        },

        name: {
            type:DataTypes.STRING,
            allowNull : false
        },

        eventDate: {
            type : DataTypes.DATE,
            allowNull : false
        },

        eventVenue : {
            type : DataTypes.STRING,
            allowNull : false
        },

        imageFirebaseLink : {
            type : DataTypes.STRING,
        },

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

    events.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return events;
};
