module.exports = (sequelize, DataTypes) => {
    const attendanceobj = sequelize.define('attendance', {
        
        attendanceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        empCode: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        date: { 
            type:DataTypes.DATEONLY ,
            allowNull: false 
        },

        checkIn: { 
            type:DataTypes.DATE ,
            allowNull: false 
        },

        checkOut: { 
            type:DataTypes.DATE
        },

        comments: { 
            type: DataTypes.TEXT, 
            allowNull: true 
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

    attendanceobj.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return attendanceobj;
};
