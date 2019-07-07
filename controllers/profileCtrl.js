var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

//return details using roles_responsibility+department

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
            let re = await utilities.verifyRole(user_credentials.roleId,'c','profiles');
            if(re) {
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
                    message : "Employee profile already exists so can't be created"
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

            if(create_obj.role_responsibility === 'Clubs') {
                if(req.body.college) {
                    create_obj.college = req.body.college
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: {
                            message: "College field is compulsory"
                        }
                    });
                    return;
                }
            }
            
            
            let validRoleID = await db.public.roles.findOne({
                where : {id : create_obj.roleId}
            })
            if (!validRoleID){
                res.status(500).json({
                    success : false,
                    message : "roleId does not exist"
                });
                return;
            }
            

            let profileCreated = await db.public.profiles.create(create_obj);
            res.status(200).json({
                success: true,
                profile: profileCreated
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
                message: "Internal server Error",
                description: err.description
            }
        });
    }
}


async function getProfile(req, res) {
    console.log('entered')
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
        console.log('TOKEN IS',authToken)
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
        console.log(user_credentials)
       if(user_credentials){

            // Check for access for endpoint
            let re = await utilities.verifyRole(user_credentials.roleId,'r','profiles');
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
            if(req.query.designation){
                query.designation = req.query.designation;
            }

            if(req.query.name) {
                query.name = {
                    [db.public.sequelize.Op.iLike]: `%${req.query.name}%`
                }
            }

            if(req.query.fountaneEmail) {
                query.fountaneEmail = req.query.fountaneEmail
            }

            if(req.query.role_responsibility) {
                query.role_responsibility = req.query.role_responsibility
            }

            if(req.query.college) {
                query.college = req.query.college
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
            res.status(500).json({
                success : false,
                error : {
                    message : "Token not found",
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


async function getDepartmentWise(req, res) {
    console.log('entered')
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
            let re = await utilities.verifyRole(user_credentials.roleId,'r','profiles');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(req.query.role_responsibility && req.query.department) {
                query.role_responsibility = req.query.role_responsibility
                query.department = req.query.department
            }
            else {
                res.status(500).json({
                    success : false,
                    message : "role_responsibility and department are required fields"
                });
                return;
            }
            

            console.log(query)
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

            let newProfile = []
            let k=0
            for(let i=0;i<profiles.length;i++) {
                newProfile[k++] = {
                    name : profiles[i].name,
                    empCode : profiles[i].empCode
                }
            }
            res.status(200).json({
                success: true,
                profile: newProfile
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
            let re = await utilities.verifyRole(user_credentials.roleId,'u','profiles');
            if(re) {
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
            
            let valid = await db.public.register.findOne({
                where : {empCode : query.empCode}
            })

            if (!valid){
                res.status(500).json({
                    success : false,
                    message : "empCode does not exist"
                });
                return;
            }
            let create_obj = req.body;
            
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
    updateProfile,
    getDepartmentWise
}