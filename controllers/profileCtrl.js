var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

async function createProfile(req,res) {
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
            if(!utilities.verifyRole(user_credentials.roleId,'c','profiles')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let valid = await db.public.profiles.findOne({
                where : {empCode:req.body.empCode}
            })

            if (valid){
                res.status(500).json({
                    status : false,
                    message : "Employ profile already exists so can't be created"
                });
                return;
            }
        
            let create_obj = {
                empCode: req.body.empCode,
                name:req.body.name,
                fountaneEmail:req.body.fountaneEmail,
                personalEmail: req.body.personalEmail,
                mobileNo:req.body.mobileNo,
                profilePic:req.body.profilePic,
                panNo: req.body.panNo,
                aadharNo: req.body.aadharNo,
                bankAccountNo: req.body.bankAccountNo,
                ifscCode: req.body.ifscCode,
                role_responsibility: req.body.role_responsibility,
                roleId: req.body.roleId,
                eduQualification: req.body.eduQualification,
                fountaneEXP: req.body.fountaneEXP,
                otherEXP: req.body.otherEXP,
                designation:req.body.designation,
                department: req.body.department,
                branchLocation: req.body.branchLocation,
                DOB:req.body.DOB,
                dateOfJoining: req.body.dateOfJoining,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                province: req.body.province,
                empType: req.body.empType   
                
            };

            for (var i in create_obj) {
                if (!create_obj[i]) {
                    if (i!="profilePic" && i!="status"){ 
                        console.log("No " + i);
                        res.status(500).json({
                            success: false,
                            message: i + " is a required field"
                        });
                        return;
                    }
                }
            }
            
            

            let profileCreated = await db.public.profiles.create(create_obj);
            res.status(200).json({
                success: true,
                profile: profileCreated
            });
            // if(req.body.empCode!=""&&req.body.name!=""&&req.body.fountaneEmail!=""&&req.body.mobileNo!=""&&req.body.designation!=""&&req.body.address!=""){
            //     let profileCreated = await db.public.profiles.create(create_obj);

            //     res.status(200).json({
            //         success: true,
            //         profile: profile_created
            //     });
            // }else{
            //     res.status(500).json({
            //         success: false,
            //         error: {
            //             message: "Please input value of all parameters"
            //         }
            //     });
            // }

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
                message: "Internal server Error",
                description: err.description
            }
        });
    }
}


async function getProfile(req, res) {
    
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
            if(!utilities.verifyRole(user_credentials.roleId,'r','profiles')) {
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
            if(req.query.designation){
                query.designation = req.query.designation;
            }
            if(req.query.name){
                query.designation = req.query.designation;
            }

            if(req.query.name) {
                query.name = req.query.name
            }


            let profiles = await db.public.profiles.findAll({
                where: query
            })
            // console.log(profiles[0])
            // console.log(profiles[0].profile)
            if(profiles[0]) {
                console.log('yes')
            }
            else {
                console.log('no')
            }

            res.status(200).json({
                success: true,
                profile: profiles
            });
      }else {
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
                message: "Request for invalid employ code",
                description: err.description
            }
        });
    }
}


// Will have to provide empCode inorder to request for profile update
async function updateProfile(req,res) {
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
            if(!utilities.verifyRole(user_credentials.roleId,'u','profiles')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};
            if (req.body.empCode){
                query.empCode = req.body.empCode;
            }

            else {
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Employ code is a required field"
                    }
                });
                return;
            }

            let create_obj = {}
            if (req.body.name && req.body.name!=""){
                create_obj.name = req.body.name;
            }

            if (req.body.mobileNo && req.body.mobileNo!=""){
                create_obj.mobileNo = req.body.mobileNo;
            }

            if (req.body.status){
                create_obj.status = req.body.status;
            }

            if (req.body.fountaneEmail && req.body.fountaneEmail!=""){
                create_obj.fountaneEmail = req.body.fountaneEmail;
            }

            if (req.body.address && req.body.address!=""){
                create_obj.address = req.body.address;
            }

            if (req.body.designation && req.body.designation!=""){
                create_obj.designation = req.body.designation;
            }

            if (req.body.profilePic && req.body.profilePic!=""){
                create_obj.profilePic = req.body.profilePic;
            }

            if (query){
                profileUpdate = await db.public.profiles.update(create_obj,
                    { where :query 
                    });
            }

            res.status(200).json({
                success : true,
                profile : profileUpdate
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
                message: "Server Error",
                description: err.description
            }
        });
    }
}


module.exports = {
    createProfile,
    getProfile,
    updateProfile
}