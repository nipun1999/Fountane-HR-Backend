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

module.exports.getUpdates = async (req, res) => {
    try{
        let projectName = req.query.project_name ? req.query.project_name : '';
        let project = await db.public.sequelize.query(`SELECT project_jiras.* 
            from project_jiras
            where project_jiras."projectName" ILIKE :projectName LIMIT 1`, {
                replacements: {
                    projectName: `${projectName}%`
                },
                type: db.public.sequelize.QueryTypes.SELECT
        });
        project = JSON.parse(JSON.stringify(project));
        if(!project.length){
            throw new Error("Can't find the project");
        }
        project = project[0];
        let projectUpdatesQuery = `SELECT project_updates.*, project_jiras."projectName" as project_name from project_updates
                                inner join project_jiras on project_jiras."projectKey" = project_updates.project_id
                                where project_updates.project_id=:projectKey 
                                and project_updates.event_date::date = COALESCE(:time_filter, NOW())::timestamp::date`;
        let projectUpdates = await db.public.sequelize.query(projectUpdatesQuery, {
            replacements: {
                projectKey: project.projectKey,
                time_filter: null
            },
            type: db.public.sequelize.QueryTypes.SELECT
        });
        projectUpdates = JSON.parse(JSON.stringify(projectUpdates));
        console.log("retrieved project updates are: ", JSON.stringify(projectUpdates));
        projectUpdates = projectUpdates.map(update=> {
            return {
                udpate: update.update,
                project: update.project_name
            };
        });
        res.status(200).json({
            success: true,
            updates: projectUpdates
        });
        return;
    }catch(error){
        console.error("error: ", error);
        res.status(500).json({
            success:false,
            error:error.message
        });
    }
}