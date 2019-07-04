
module.exports = (sequelize, DataTypes) => {
    const companyobj = sequelize.define('companydetails', {
        
        empCode: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey : true
        },
        dateJoin:{
            type: DataTypes.DATEONLY,
            allowNull :false
        },
        location:{
            type: DataTypes.STRING,
            allowNull :false
        },
        typeOfEmployee:{
            type: DataTypes.STRING,
            allowNull : false
        },
        status:{
            type: DataTypes.STRING,
            allowNull : false,
        },
        personalEmail:{
            type: DataTypes.STRING,
            allowNull : false
        },
        postalAddress:{
            type: DataTypes.TEXT,
            allowNull : false
        },
        PWT:{
            type: DataTypes.STRING,
            allowNull : false
        },
        manager:{
            type: DataTypes.STRING,
            allowNull : false
        },

        department: {
            type: DataTypes.STRING,
            allowNull: false
        },

        panCardNo: { 
            type: DataTypes.STRING,
            allowNull: false 
        },

        workingTime : {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        bankCardNo: { 
            type: DataTypes.STRING,
            allowNull: false 
        },
        ifscCode:{
            type: DataTypes.STRING,
            allowNull : false
        },
        RR:{
            type: DataTypes.TEXT,
            allowNull : false
        },
        EXPFountane:{
            type: DataTypes.STRING,
            allowNull : false
        },
        EXPOthers:{
            type: DataTypes.STRING,
            allowNull : false
        },
        EDUQualification:{
            type: DataTypes.STRING,
            allowNull : false
        },
    });

    companyobj.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return companyobj;
};
