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
               toDate: req.body.toDate, 
               description : req.body.description
            };

            for (var i in create_obj){
                if (!create_obj[i]){
                    res.status(500).json({
                        success : false,
                        message : i + " is a required field"
                    });
                    return;
                }
            }
            
            let valid = await db.public.register.findOne({
                where : {empCode : create_obj.empCode}
            })

            if (!valid){
                res.status(500).json({
                    success : false,
                    message : "empCode does not exist"
                });
                return ;
            }
            leaveCountValue = await db.public.profiles.findOne(
                {where : {empCode : create_obj.empCode}}
            )
            if(!leaveCountValue[create_obj.leaveType]) {
                res.status(500).json({
                    success: false,
                    message: "No sufficient leaves"
                });
                return;
            }

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
                leaves : values
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
            query.leaveId = req.body.leaveId;

            leaveValues = await db.public.leavesobj.findOne({where:query})
            if(!leaveValues) {
                //error
                res.status(500).json({
                    success: false,
                    message: "No leaveId as such exists"
                });
                return;
            }
            type = leaveValues.leaveType

            leaveCountValue = await db.public.profiles.findOne(
                {where : {empCode : leaveValues.empCode}}
            )
            
            leaveCount = leaveCountValue[type] - 1
            if (query) {

                leaveUpdated = await db.public.leavesobj.update(
                    {status : 'accepted'} , { where : query }
                );
                leveaeCountDecrement = await db.public.profiles.update(
                    { [type] : leaveCount } , { where : { empCode : leaveValues.empCode}}
                )
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
            query.leaveId = req.body.leaveId;
            if (query){
                leaveUpdated = await db.public.leavesobj.update({status:'rejected'},
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