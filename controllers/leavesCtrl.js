var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


async function create(req, res){
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

            if(!utilities.verifyRole(user_credentials.roleId,'c','leaves')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let create_obj = {
               empCode: req.body.empCode,
               leaveType: req.body.leaveType,
               fromDate: req.body.fromDate,
               toDate: req.body.toDate  
            };

            let leaves_created = await db.public.leavesobj.create(create_obj);

            res.status(200).json({
                success: true,
                leavesobj: leaves_created
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
                message: "Internal Server Error",
                description: err.description
            }
        });
    }

} 

async function get(req, res) {


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

            if(!utilities.verifyRole(user_credentials.roleId,'r','leaves')) {
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
            
            if(req.query.leaveType){
                query.leaveType = req.query.leaveType;
            }
            
            if(req.query.status){
                query.status = req.query.status;
            }

            let values = await db.public.leavesobj.findAll({
                where: query
            })


            res.status(200).json({
                success: true,
                kv: values
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

async function updateTrue(req,res) {
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

            if(!utilities.verifyRole(user_credentials.roleId,'u','leaves')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
            
            let query = {};
            query.empCode = req.body.empCode;
            if (query){
                leaveUpdated = await db.public.leavesobj.update({status:true},
                    { where :query 
                    });
            }

            res.status(200).json({
                success : true,
                leavesobj : leaveUpdated
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

async function updateFalse(req,res) {
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

            if(!utilities.verifyRole(user_credentials.roleId,'u','leaves')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};
            query.empCode = req.body.empCode;
            if (query){
                leaveUpdated = await db.public.leavesobj.update({status:false},
                    { where :query 
                    });
            }

            res.status(200).json({
                success : true,
                leavesobj : leaveUpdated
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
    create,
    get,
    updateTrue,
    updateFalse
}