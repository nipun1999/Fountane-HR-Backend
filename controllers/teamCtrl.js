var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

async function createTeamMember(req,res) {
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


        if (user_credentials) {

            // Check for access for endpoint
            if(!utilities.verifyRole(user_credentials.roleId,'c','teams')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let create_obj = {
                TLempCode : req.body.TLempCode,
                empCode : req.body.empCode
            };
        
            for (var i in create_obj) {
                if (!create_obj[i]) {
                    console.log("No " + i);
                    res.status(500).json({
                        success: false,
                        message: i + " is a required field"
                    });
                    return;
                }
            }

            let obj1 = await db.public.profiles.findOne({
                where : {empCode:req.body.empCode}
            });


            if (!obj1){
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Employ code provided does not exist"
                    }
                });
                return;
            }

            let obj2 = await db.public.profiles.findOne({
                where : {empCode:req.body.TLempCode}
            });


            if (!obj2){
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Team lead Employ code provided does not exist"
                    }
                });
                return;
            }
                    
            let obj = await db.public.team.findOne({
                where : create_obj
            });


            if (!obj){
                let teamLead = await db.public.team.create(create_obj);
                res.status(200).json({
                    success: true,
                    TL : teamLead
                });
            }
            else {
                res.status(200).json({
                    success : false,
                    error : {
                        message : "Current team lead for requested employ already exists"
                    }
                });
                return;
            }
        
                    
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


// async function getTeamLead(req, res) {
    
//     try {
//         // Authoization check for JWT token
//         var authToken = req.header('X-AUTH-TOKEN')

//         if (authToken == null || authToken ==""){
//             res.status(500).json({
//                 success: false,
//                 error : {
//                     message : "Token not provided"
//                 }
//             });
//             return;
//         }

//         try {
//             var user_credentials = utilities.decryptJWTWithToken(authToken);
//         }
//         catch(err){
//             res.status(500).json({
//                 success : false,
//                 error : {
//                     message : "Invalid token provided"
//                 }
//             });
//         }

//         if (user_credentials){

                // Check for access for endpoint
            // if(!utilities.verifyRole(user_credentials.roleId,'r','teams')) {
            //     res.status(500).json({
            //         success : false,
            //         message : "Permissions not available"
            //     });
            //     return;
            // }

//             let query = {};

//             if(req.query.empCode){
//                 query.empCode = req.query.empCode;
//             }
            

//             let teamLead = await db.public.team.findAll({
//                 where: query
//             })
    
//             res.status(200).json({
//                 success: true,
//                 TL : teamLead
//             });
//         }

//         else {
//             res.status(500).json({
//                 success : false,
//                 error : {
//                     message : "Token not found",
//                 }
//             });
//             return;
//         }

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             error: {
//                 message: "Internal Server Error",
//                 description: err.description
//             }
//         });
//     }
// }

async function getTeamMember(req, res) {
    
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
            if(!utilities.verifyRole(user_credentials.roleId,'r','teams')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(req.query.TLempCode){
                query.TLempCode = req.query.TLempCode;
            }
            

            let teamMember = await db.public.team.findAll({
                where: query
            })
    
            res.status(200).json({
                success: true,
                TM : teamMember
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
    createTeamMember,
    //getTeamLead,
    getTeamMember
}