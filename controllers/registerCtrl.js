var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var crypto = require("crypto");


async function create(req, res){
    console.log('\n\n\nRequest\n',req)
    console.log('\n\n\nResponse\n',res)
    try {
        
        let create_obj = {
           empCode: req.body.empCode,
           fountaneEmail: req.body.fountaneEmail,
           name: req.body.name
        };

        for (var i in create_obj){
            if (!create_obj[i]){
                console.log("No " + i);
                res.status(500).json({
                    status : false,
                    message : i + " is a required field"
                })
            }
        }

        let check = await db.public.register.findOne({
            where : {empCode : req.body.empCode}
        });

        if (check){
            res.status(500).json({
                status : false,
                message : "Employ code already exists"
            });
            return;
        }

        let valid = await db.public.register.findOne({
            where : {fountaneEmail : create_obj.fountaneEmail}
        })
        if (valid){
            res.status(500).json({
                success : false,
                message : "fountaneEmail already exists"
            });
            return;
        }

        let registration = await db.public.register.create(create_obj);

        res.status(200).json({
            success: true,
            register: registration
        });

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


async function signup(req, res){
    try {
        var salt = crypto.randomBytes(16).toString('hex');
        var password = crypto.pbkdf2Sync(req.body.password, salt, 1000, 512, "sha512").toString('hex');
        let create_obj = {
           fountaneEmail: req.body.fountaneEmail,
           password: password,
           salt:salt
        };

        for (var i in create_obj){
            if (!create_obj[i]){
                res.status(500).json({
                    success : false,
                    message : i + "  is a required field"
                });
                return;
            }
        }
        
        // let valid = await db.public.roles.findOne({
        //     where : {id : create_obj.roleId}
        // })
        // if (!valid){
        //     res.status(500).json({
        //         success : false,
        //         message : "roleId does not exist"
        //     });
        //     return;
        // }
        let query = {};
        query.fountaneEmail = req.body.fountaneEmail;
        let check_email = await db.public.register.findOne({
            where:query
        })

        if(check_email){
            create_obj.empCode = check_email.empCode;
            let valid = await db.public.signInObj.findOne({
                where : {fountaneEmail : create_obj.fountaneEmail}
            })
            if (valid){
                res.status(500).json({
                    success : false,
                    message : "fountaneEmail already exists"
                });
                return;
            }
            let signup = await db.public.signInObj.create(create_obj);
            res.status(200).json({
                success: true,
                checkEmail:check_email
            });
        }else{
            res.status(200).json({
                success: false,
                message:'Email not found. Contact HR.'
            });
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


module.exports = {
    create,
    signup
}