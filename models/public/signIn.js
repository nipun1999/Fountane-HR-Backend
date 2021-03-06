module.exports = (sequelize, DataTypes) => {
    const signInObj = sequelize.define('sign', {
        
        empCode: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },

        fountaneEmail: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        password: { 
            type:DataTypes.TEXT ,
            allowNull: false 
        },

        salt: { 
            type:DataTypes.TEXT ,
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

        signInObj.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return signInObj;
};
