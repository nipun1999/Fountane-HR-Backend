
module.exports = (sequelize, DataTypes) => {
    const register = sequelize.define('registration', {
        
        empCode: {
            type: DataTypes.STRING,
            primaryKey : true,
            allowNull: false
        },

        fountaneEmail: { 
            type:DataTypes.STRING,
            allowNull: false,
            unique: true,
         },

        newUser: {
            type : DataTypes.BOOLEAN,
            defaultValue : true
        },

        name:{
            type:DataTypes.STRING,
            allowNull:false
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

    register.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return register;
};
