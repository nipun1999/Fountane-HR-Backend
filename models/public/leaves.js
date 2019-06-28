
module.exports = (sequelize, DataTypes) => {
    const leavesobj = sequelize.define('leaves', {
        leaveId : {
            type: DataTypes.INTEGER,
            primaryKey : true,
            allowNull:false,
            autoIncrement:true
        },
        empCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        leaveType: { type: DataTypes.STRING, allowNull: false },

        fromDate: { type: DataTypes.DATEONLY, allowNull: false },

        toDate: { type: DataTypes.DATEONLY, allowNull: false },

        status: { 
            type: DataTypes.STRING,
            defaultValue: "pending",
            allowNull: false
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

    leavesobj.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return leavesobj;
};
