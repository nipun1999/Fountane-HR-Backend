
module.exports = (sequelize, DataTypes) => {
    const profile = sequelize.define('profile', {
        
        empCode: {
            type:DataTypes.STRING,
            primaryKey : true
        },

        name: {
            type:DataTypes.STRING,
        },

        fountaneEmail: {
            type: DataTypes.STRING,
        },

        personalEmail: {
            type: DataTypes.STRING,
        },

        mobileNo: {
            type: DataTypes.STRING,
        },

        profilePic : {
            type:DataTypes.STRING},

        panNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        aadharNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        bankAccountNo: {
            type: DataTypes.STRING,
            allowNull: false
        },

        ifscCode: {
            type: DataTypes.STRING,
            allowNull: false
        },

        roleId:{
            type: DataTypes.BIGINT,
            allowNull: false
        },

        eduQualificaton: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        fountaneEXP: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        otherEXP: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        designation : {
            type:DataTypes.STRING,
            allowNull: false
        },

        department : {
            type:DataTypes.STRING,
            allowNull: false
        },

        branchLocation : {
            type:DataTypes.STRING,
            allowNull: false
        },

        DOB : {
            type:DataTypes.DATEONLY,
            allowNull: false
        },

        dateOfJoining: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        country : {
            type:DataTypes.STRING,
            allowNull: false
        },

        state: {
            type: DataTypes.STRING,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false
        },

        province: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        empType: {
            type:DataTypes.STRING,
            allowNull: false
        },

        role_responsibility:{
            type:DataTypes.TEXT,
            allowNull: false
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

    profile.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return profile;
};
