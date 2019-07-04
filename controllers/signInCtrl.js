var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var shortid = require('shortid'); // shortid() or shortid.generate(); to generate a short id
// var uuidv4 = require('uuid/v4'); // UUID generator; uuidv4(); to generate the uuid
var nunjucks = require("nunjucks");
var fs = require('fs');
var path = require('path');

var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


//OAuth

var {OAuth2Client} = require('google-auth-library');

async function checkUser(req, res){
    create_obj = {
        fountaneEmail : req.body.fountaneEmail,
        password : req.body.password

    }

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


    //if email not present in sign in table then null will be returned when findOne function is used
    let user = await db.public.signInObj.findOne({
        where: {
            fountaneEmail: req.body.fountaneEmail
        }
    })

    let userProfile = await db.public.profiles.findOne({
        where: {
            fountaneEmail: req.body.fountaneEmail
        }
    })


    console.log(userProfile)
    
    // console.log(user);
    if (user) {
        let user2 = await db.public.register.findOne({
            where : {fountaneEmail : user.fountaneEmail}
        })

        var newUserStatus = user2.newUser;
        if(newUserStatus==true){
            newUserUpdate = await db.public.register.update({newUser:false},{
                where:{
                    fountaneEmail: user.fountaneEmail
                }
            })
        }
        let password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');



        if (user.password === password) {
            // Get user profile
            
            var auth_data = {
                fountaneEmail: user.fountaneEmail,
                empCode: user.empCode,
                created_at: new Date(),
                roleId : userProfile.roleId
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            
            res.status(200).json({
                success: true,
                auth: auth_data,
                token: token,
                name : user2.name,
                empCode : user.empCode,
                status : newUserStatus
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Incorrect Password. Please try again."
            });
        }

    } else {
        res.status(500).json({
            success: false,
            error: {
                message: "We could not find your account."
            }
        });
    }    
}



async function checkUserGoogle(req, res){
        const CLIENT_ID = '498233300103-3p9u6r2rmlru42i40d421ju1ljosdca9.apps.googleusercontent.com'
        const client = new OAuth2Client(CLIENT_ID);
        const idToken = req.body.idToken;
        if(idToken!=null){

            try{

                const ticket = await client.verifyIdToken({
                    idToken: idToken,
                    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                    // Or, if multiple clients access the backend:
                    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
                });
                const payload = ticket.getPayload();
                const userid = payload['sub'];
                // If request specified a G Suite domain:
                //const domain = payload['hd'];
                const email = payload['email'];

                let user = await db.public.register.findOne({
                    where: {
                        fountaneEmail: email
                    }
                })

                let userProfile = await db.public.profiles.findOne({
                    where : {
                        fountaneEmail : req.body.fountaneEmail
                    }
                })

                if(user) {

                    var newUserStatus = user.newUser;
                    if(newUserStatus==true){
                        newUserUpdate = await db.public.register.update({newUser:false},{
                            where:{
                                fountaneEmail: email
                            }
                        })
                    }
                    //User exists so generate a token
                    var auth_data = {
                        fountaneEmail: user.fountaneEmail,
                        empCode: user.empCode,
                        roleId : userProfile.roleId,
                        created_at: new Date()
                    };
            
                    var token = jwt.sign(auth_data, config.app.jwtKey); 
            
                    res.status(200).json({
                        success: true,
                        empCode : user.empCode,
                        name: user.name,
                        token: token,
                        status : newUserStatus
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: "Email not registered.Please contact HR"
                    });
                }

            }catch{

                res.status(500).json({
                    success: false,
                    message: "Invalid token"
                });
            
            }
            
        //Check if this email exists in register table
            
    }else{
        res.status(500).json({
            success: false,
            message: "Please input valid token"
        });
    }
}


module.exports = {
    checkUser,
    checkUserGoogle
}
