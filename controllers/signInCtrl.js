var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

var crypto = require("crypto");


async function checkUser(req, res){

    if (!req.body.fountaneEmail || !req.body.password) {
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
    checkUser
}
