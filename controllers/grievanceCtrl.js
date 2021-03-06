var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var iams = require("../functions/roleFunc");

async function createGrievances(req,res) {
    try {
        
        // Authoization check for JWT token
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


        //userHasAccess = iams.verifyRole(user_credentials, entity, entity_id, 14);


        if (user_credentials) {
            let re = await utilities.verifyRole(user_credentials.roleId,'c','grievances');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let create_obj = {
                description: req.body.description,
                status: req.body.status,
                empCode: req.body.empCode
            };

            let value = await db.public.register.findOne({
                where : {empCode : req.body.empCode}
            })

            if (!value){
                res.status(500).json({
                    status : false,
                    message : "Employ code provided does not exist"
                });
                return;
            }
        
            for (var i in create_obj) {
                if (i!="status"){ 
                    if (!create_obj[i]) {
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }
            }
        
            let grievanceCreated = await db.public.grievances.create(create_obj);
            res.status(200).json({
                success: true,
                grievance: grievanceCreated
            });        
        }

        else {
            console.log(err);
            res.status(500).json({
                success : false,
                error : {
                    message : "Token not found",
                    description : err.description
                }
            });
            return;
        }
            
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal Server Error!",
                description: err.description
            }
        });
    }
    
}


async function getGrievances(req, res) {
    
    try {
        // Authoization check for JWT token
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
            let re = await utilities.verifyRole(user_credentials.roleId,'r','grievances');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(req.query.empCode){
                query.empCode = req.query.empCode;
            }

            if(req.query.status){
                query.status = req.query.status;
            }

                let grievances = await db.public.grievances.findAll({
                    where: query
                })
        
                res.status(200).json({
                    success: true,
                    grievance: grievances
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

async function updateGrievancesTrue(req,res) {
    try {

        // Authoization check for JWT token
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
            let re = await utilities.verifyRole(user_credentials.roleId,'u','grievances');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};
            if (!req.body.grievanceId){
                res.status(500).json({
                    success : false,
                    message : "Grievance Id is a required parameter"
                });
                return ;
            }
            query.grievanceId = req.body.grievanceId;

            let value = await db.public.grievances.findOne({
                where : {grievanceId : req.body.grievanceId}
            })
            if (!value){
                res.status(500).json({
                    success : false,
                    message : "Grievance Id provided does not exist"
                });
                return;
            }

            if (query){
                grievanceUpdate = await db.public.grievances.update({status:true},
                    { where :query 
                    });
            }

            res.status(200).json({
                success : true,
                grievance : grievanceUpdate
            });
        }

        else {
            console.log(err);
            res.status(500).json({
                success : false,
                error : {
                    message : "Token not found",
                    description : err.description
                }
            });
            return;
        }
            
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please put all body parameters",
                description: err.description
            }
        });
    }
}

async function updateGrievancesFalse(req,res) {
    try {

        // Authoization check for JWT token
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

            // Check for access for endpoint
            let re = await utilities.verifyRole(user_credentials.roleId,'u','grievances');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if (!req.body.grievanceId){
                res.status(500).json({
                    success : false,
                    message : "Grievance Id is a required body parameter"
                });
                return ;
            }

            let value = await db.public.grievances.findOne({
                where : {grievanceId : req.body.grievanceId}
            })

            if (!value){
                res.status(500).json({
                    success : false,
                    message : "Grievance Id provided does not exist"
                });
                return;
            }

            query.grievanceId = req.body.grievanceId;
            if (query){
                grievanceUpdate = await db.public.grievances.update({status:false},
                    { where :query 
                    });
            }

            res.status(200).json({
                success : true,
                grievance : grievanceUpdate
            });
        }

        else {
            console.log(err);
            res.status(500).json({
                success : false,
                error : {
                    message : "Token not found",
                    description : err.description
                }
            });
            return;
        }
            
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please put all body parameters",
                description: err.description
            }
        });
    }
}


module.exports = {
    createGrievances,
    getGrievances,
    updateGrievancesTrue,
    updateGrievancesFalse
}