
module.exports = (sequelize, DataTypes) => {
    const profile = sequelize.define('profile', {
        
        empCode: {type:DataTypes.STRING , allowNull:false},

        name: { type:DataTypes.STRING , allowNull:false },

        fountaneEmail: { type: DataTypes.STRING, allowNull: false },
        
        mobileNo: { type: DataTypes.STRING, allowNull: false },
        
        profilePic : {type:DataTypes.STRING},
        
        status : {
            type : DataTypes.BOOLEAN , 
            allowNull : false,
            defaultValue : false
        },

        designation : {type:DataTypes.STRING , allowNull:false},

        DOB : {type:DataTypes.DATEONLY , allowNull:false},

        address : {type:DataTypes.STRING , allowNull:false},

        other_data: { type: DataTypes.JSONB },

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
