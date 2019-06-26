
module.exports = (sequelize, DataTypes) => {
    const profile = sequelize.define('profile', {
        

        empCode: {type:DataTypes.STRING,
            primaryKey : true
        },

        name: { type:DataTypes.STRING},

        fountaneEmail: { type: DataTypes.STRING},
        

        mobileNo: { type: DataTypes.STRING},

        
        // profilePic : {type:DataTypes.STRING},
        
        // status : {
        //     type : DataTypes.BOOLEAN , 
        //     defaultValue : false
        // },

        designation : {type:DataTypes.STRING},

    

        // DOB : {type:DataTypes.DATEONLY},


        // address : {type:DataTypes.STRING},

        // other_data: { type: DataTypes.JSONB },

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
