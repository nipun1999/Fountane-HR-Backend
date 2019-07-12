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

async function getProject(req,res) {
    
    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }if(user) {
 
            let re = await utilities.verifyRole(user.roleId,'r','attendances');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
            // get projects by email
            let query = {}
            
            if(req.query.fountaneEmail) {
                query.fountaneEmail = req.query.fountaneEmail
            }
            let result = await db.public.project.findAll({
                where : query
            })
            //result -> array of project tupules
            let projectName = []; let k = 0;
            let queryForName = {}
            for(let project of result) {
                queryForName.projectID = project.projectID
                let project_jira = await db.public.project_jira.findOne({
                    where : queryForName
                })
                console.log(project_jira)
                projectName[k++] = project_jira.projectName
            }
            
            res.status(200).json({
                success : true,
                projectName : projectName
            })
            //get projects by name ? (if full name provided find email from profiles)
            
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
            return ;
        }
       
 
    } catch (err) {
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
    issueUpdated,
    getProject
}
