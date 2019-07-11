var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

async function createProject(req, res){
    
	console.log('the fucking request isis ',req)
    try {
        console.log('PROJECT ID ',req.body.project.id)
        console.log('PROJECT NAME ',req.body.project.name)
    } catch(err) {
        console.log(err);
        
    }
} 

async function issueUpdated(req, res){
    

    try {

        let eventType = req.body.issue_event_type_name
        if(eventType === 'issue_assigned') {
            //user assigned an issue.. add user to that project
            console.log('issue id ',req.body.issue.id)
            console.log('project id ',req.body.issue.fields.project.id,req.body.issue.fields.project.name)
            console.log('name of issue ',req.body.issue.fields.summary)
            console.log('email ',req.body.issue.assignee.emailAddress)
            //give status null      
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
