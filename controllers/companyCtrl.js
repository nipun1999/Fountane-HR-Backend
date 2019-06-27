var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


async function create(req, res){
    

    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch(err){
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {

            if(!utilities.verifyRole(user.roleId,'c','companyDetails')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let valid = await db.public.companyobj.findOne({
                where : {empCode : req.body.empCode}
            })

            if (valid){
                res.status(500).json({
                    status : false,
                    message : "Company details for requested employ code already exists so cannot be created"
                });
                return ;
            }

            let create_obj = {
                empCode: req.body.empCode,
                dateJoin: req.body.dateJoin,
                location: req.body.location,
                typeOfEmployee: req.body.typeOfEmployee,
                status: req.body.status,
                personalEmail: req.body.personalEmail,
                postalAddress: req.body.postalAddress,
                PWT: req.body.PWT,
                manager: req.body.manager,
                department: req.body.department,
                panCardNo: req.body.panCardNo,
                bankCardNo: req.body.bankCardNo,
                ifscCode: req.body.ifscCode,
                RR: req.body.RR,
                EXPFountane: req.body.EXPFountane,
                EXPOthers: req.body.EXPOthers,
                EDUQualification: req.body.EDUQualification,
            };
    
            let companyobj_created = await db.public.companyobj.create(create_obj);
    
            res.status(200).json({
                success: true,
                companyobj: companyobj_created
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
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

async function get(req, res) {


    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {


            if(!utilities.verifyRole(user.roleId,'r','companyDetails')) {
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

            if(req.query.branch){
                query.branch = req.query.branch;
            }

            if(req.query.dateJoin){
                query.dateJoin = req.query.dateJoin;
            }
            if(req.query.manager){
                query.manager = req.query.manager;
            }

            if(req.query.department){
                query.department = req.query.department;
            }

            let values = await db.public.companyobj.findAll({
                where: query
            })


            res.status(200).json({
                success: true,
                companyobj: values
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
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


async function update(req,res) {
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {

            if(!utilities.verifyRole(user.roleId,'u','companyDetails')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            query.empCode = req.body.empCode;
            if(query)
            {
                let key = req.body;
                console.log(key);
                // for(var obj in key)
                // {
                //     console.log(obj);
                //     var value = key[obj];
                //     if(true)
                    // {
                    companyUpdate = await db.public.companyobj.update(key,
                        { 
                            where :query
                        });
                    // }
                // }
            }

            res.status(200).json({
                success : true,
                companyobj : companyUpdate
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
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
    update
}