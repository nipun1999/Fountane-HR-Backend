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
            console.log('email ',req.body.issue.assignee.emailAddress)
            console.log('\n\nbody',req.body)
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

async function getProject(req, res) {
    
    try {
        // Authorization check for JWT token
        var authToken = req.header('X-AUTH-TOKEN')

        if (authToken == null || authToken ==""){
            res.status(500).json({
                success: false,
                error : {
                    message : "Token not provided"
                }
            });
            return;
        }

        try {
            var user_credentials = utilities.decryptJWTWithToken(authToken);
        }
        catch(err){
            res.status(500).json({
                success : false,
                error : {
                    message : "Invalid token provided"
                }
            });
        }

        if (user_credentials){
            let re = await utilities.verifyRole(user_credentials.roleId,'r','events');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if (!req.query.empCode){
                res.status(500).json({
                    success : false,
                    message : "empCode is a required field"
                });
                return;
            }

            if(req.query.status){
                query.status = req.query.status;
            }
            
            let email = await db.public.profiles.findOne({
                where : {empCode : query.empCode}
            })

            if (!email){
                res.status(500).json({
                    success : false,
                    message : "empCode does not exist"
                });
                return;
            }

            fountaneEmail = email.fountaneEmail;
            query.fountaneEmail = fountaneEmail;

            let getProjects = await db.public.project.findAll({
                where: query
            })
    
            res.status(200).json({
                success: true,
                events : getEvent
            });
        }

        else {
            res.status(500).json({
                success : false,
                error : {
                    message : "Token not found",
                }
            });
            return;
        }

    } catch (err) {
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
