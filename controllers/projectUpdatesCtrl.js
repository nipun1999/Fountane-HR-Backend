var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

module.exports.createUpdate = async (req, res) => {
    try{
        let update = req.body.updateMessage;
        let projectName = req.body.projectName;
        let project = await db.public.sequelize.query(`SELECT project_jiras.* 
            from project_jiras
            where project_jiras."projectName" ILIKE :projectName LIMIT 1`, {
                replacements: {
                    projectName: `${projectName}%`
                },
                type: db.public.sequelize.QueryTypes.SELECT
        });
        project = JSON.parse(JSON.stringify(project));
        project = project[0];
        await db.public.project_updates.create({
            project_id: project.projectKey,
            update,
            event_date: new Date()
        });
        res.status(200).json({
            success:true
        });
        return;
    }catch(error){
        console.error("error occured: ", error);
        res.status(500).json({
            success:false,
            error: error.message
        });
        return;
    }
}