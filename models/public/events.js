
module.exports = (sequelize, DataTypes) => {
    const events = sequelize.define('events', {
        

        empCode: {
            type:DataTypes.STRING,
        },

        name: {
            type:DataTypes.STRING,
        },

        eventDate: {
            type : DataTypes.DATEONLY,
        },

        eventVenue : {
            type : DataTypes.STRING,
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

    events.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return events;
};
