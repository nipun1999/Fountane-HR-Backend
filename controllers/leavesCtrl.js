var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

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
            let re = await utilities.verifyRole(user_credentials.roleId,'c','leaves');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
            ///////// empCode + fromDate + toDate should be unique
            let create_obj = {
               empCode: req.body.empCode,
               leaveType: req.body.leaveType,
               fromDate: req.body.fromDate,
               toDate: req.body.toDate, 
               description : req.body.description
            };
            let noOfDays = 1+date_diff_indays(create_obj.fromDate,create_obj.toDate)

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
            if(leaveCountValue[create_obj.leaveType] < noOfDays) {
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
            let re = await utilities.verifyRole(user_credentials.roleId,'r','leaves');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
            console.log('user ris',user_credentials)
            let query = {};
            if(user_credentials.roleId == 1) {
                //employee
                query.empCode = user_credentials.empCode
            }
            else {
                //admin
                if(req.query.empCode){
                    query.empCode = req.query.empCode;
                }
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
            let re = await utilities.verifyRole(user_credentials.roleId,'u','leaves');
            if(re) {
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
            let noOfDays = date_diff_indays(leaveValues.fromDate,leaveValues.toDate)+1
            leaveCountValue = await db.public.profiles.findOne(
                {where : {empCode : leaveValues.empCode}}
            )
            
            leaveCount = leaveCountValue[type] - noOfDays
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

async function updateCount(req,res) {
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
            let re = await utilities.verifyRole(user_credentials.roleId,'u','leaves');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let check = req.body.empCode;
            if (!check){
                res.status(500).json({
                    success : false,
                    message : "empCode is a required field"
                });
                return;
            }

            let valid = await db.public.register.findOne({
                where : {empCode : req.body.empCode}
            });
            if (!valid){
                res.status(500).json({
                    success : false,
                    message : "empCode does not exist"
                });
                return;
            }

            let update_obj  = {
                casualLeave : 15,
                sickLeave : 15,
                otherLeave : 15,
                paidLeave : 15,
                optionalLeave : 15
            }

            let leaveUpdated = await db.public.profiles.update(update_obj,{
                where : {empCode : req.body.empCode}
            });

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
            let re = await utilities.verifyRole(user_credentials.roleId,'u','leaves');
            if(re) {
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
    updateFalse,
    updateCount
}