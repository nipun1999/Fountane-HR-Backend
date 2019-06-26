
module.exports = (sequelize, DataTypes) => {
    const register = sequelize.define('registration', {
        
        empCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        fountaneEmail: { 
            type:DataTypes.STRING,
            allowNull: false,
            unique: true,
         },

        name:{
            type:DataTypes.STRING,
            allowNull:false
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

    register.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return register;
};
