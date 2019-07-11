var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

async function createProject(req, res){
    
	
    try {
        let create_obj = {
            projectID : req.body.project.id,
            projectName : req.body.project.name
        }
        let result = await db.public.project_jira.create(create_obj)
        console.log(result)
    } catch(err) {
        console.log(err);
    }
} 

async function issueUpdated(req, res){
    

    try {

        let eventType = req.body.issue_event_type_name
        if(eventType === 'issue_assigned') {
            //user assigned an issue.. add user to that project
            let create_obj = {
                projectID :req.body.issue.fields.project.id,
                fountaneEmail :req.body.issue.assignee.emailAddress,
                issueId :req.body.issue.id,
                issueName: req.body.issue.fields.summary
            }
            let result = await db.public.project.create(create_obj)
            console.log(result)
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error",
                description: err.description
            }
        });
    }
} 
module.exports = {
    createProject,
    issueUpdated
}
