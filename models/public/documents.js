
module.exports = (sequelize, DataTypes) => {
    const docs = sequelize.define('documents', {
        
        documentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        empCode: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        name: { 
            type:DataTypes.STRING ,
            allowNull: false 
        },

        type: { 
            type:DataTypes.STRING ,
            allowNull: false 
        },

        firebaseLink: { 
            type: DataTypes.STRING, 
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

    docs.addHook('afterCreate', 'postOnboarding', (permission, options) => {
        console.log("Data to be written in redis here");
    });
    return docs;
};
