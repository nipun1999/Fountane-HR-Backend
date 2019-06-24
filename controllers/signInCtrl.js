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
    
    console.log(user);
    if (user.length) {
        let password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');

        if (user.password === password) {
            // Get user profile
            
            var auth_data = {
                fountaneEmail: user.fountanEmail,
                empCode: user.empCode,
                created_at: new Date()
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            
            res.status(200).json({
                success: true,
                auth: auth_data,
                token: token,
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

    // if (!req.body.fountaneEmail || !req.body.password) {
    //     console.log(req.body);
    //     res.status(500).json({
    //         success: false,
    //         message: "All fields are required"
    //     });
    //     return;
    // }
    if (!req.body.fountaneEmail) {
        console.log(req.body);
        res.status(500).json({
            success: false,
            message: "All fields are required"
        });
        return;
    }
    //if email not present in sign in table then null will be returned when findOne function is used
    let user = await db.public.signInObj.findOne({
        where: {
            fountaneEmail: req.body.fountaneEmail
        }
    })
    
    console.log(user);
    if (user) {
        let password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');

        if (user.password == password) {
            res.status(200).json({
                success: true,
                message: "Succesful sign in",
                user : user
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



module.exports = {
    checkUser,
    checkUserGoogle
}
