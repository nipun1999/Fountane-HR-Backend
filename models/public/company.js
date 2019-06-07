
module.exports = (sequelize, DataTypes) => {
    const companyobj = sequelize.define('companyDetails', {
        
        empCode: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },

        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        branch: { 
            type: DataTypes.STRING,
            allowNull: false 
        },

        department: { 
            type: DataTypes.STRING,
            allowNull: false 
        }
    });

    companyobj.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return companyobj;
};
