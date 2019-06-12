var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

async function createProfile(req,res) {
    try {
        
        let create_obj = {
            empCode: req.body.empCode,
            status: req.body.status,
            name:req.body.name,
            fountaneEmail:req.body.fountaneEmail,
            mobileNo:req.body.mobileNo,
            profilePic:req.body.profilePic,
            designation:req.body.designation,
            DOB:req.body.DOB,
            address:req.body.address
        };

        for (var i in create_obj) {
            if (create_obj[i]!="profilePic" && create_obj!="status"){ 
                if (!create_obj) {
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
        
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal server error",
                description: err.description
            }
        });
    }
}


async function getProfile(req, res) {
    
    try {

        let query = {};

        if(req.query.empCode){
            query.empCode = req.query.empCode;
        }


            let profiles = await db.public.profiles.findAll({
                where: query
            })
    
            res.status(200).json({
                success: true,
                profile: profiles
            });

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

async function updateProfile(req,res) {
    try {
        
        let query = {};
        if (req.body.empCode){
            empCode = req.body.empCode;
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
        
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please enter valid employ code or valid body parameters",
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