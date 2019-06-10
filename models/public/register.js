
module.exports = (sequelize, DataTypes) => {
    const register = sequelize.define('register', {
        
        empCode: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fountaneEmail: { type:DataTypes.STRING,allowNull: false },

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
