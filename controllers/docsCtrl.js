var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");



async function create(req, res){
    

    try {
        //
        
        var authTOKEN = req.header('X-AUTH-TOKEN');
        console.log(authTOKEN);
        console.log('==============================================================================================================================================================================================================================================================================================')
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        // try{
            
        //     var user = utilities.decryptJWTWithToken(authTOKEN)
        // }    
        // catch{
        //     res.status(500).json({
        //         success: false,
        //         error: {
        //             message: "invalid Token"
        //         }
        //     });    
        // }
        user = 1
        if(user) {

            // Check for access for endpoint
            if(!utilities.verifyRole(user.roleId,'c','documents')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let create_obj = {
                empCode: req.body.empCode,
                name: req.body.name,
                type: req.body.type,
                firebaseLink: req.body.firebaseLink,
            };

            for (var i in create_obj){
                if (!create_obj[i]){
                    console.log("No "+i);
                    res.status(500).json({
                        status : false,
                        message : i + " is a required field"
                    });
                    return;
                }
            }
    
            let documentsCreated = await db.public.docs.create(create_obj);
    
            res.status(200).json({
                success: true,
                docs: documentsCreated
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

async function get(req, res){

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

            // Check for access for endpoint
            if(!utilities.verifyRole(user.roleId,'r','documents')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(user.roleId == 1){
                if(req.query.empCode){
                    query.empCode = req.query.empCode;
                }
            }else{
                query.empCode = user.empCode;
            }

            let values = await db.public.docs.findAll({
                where: query
            })


            res.status(200).json({
                success: true,
                docs: values
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

async function destroy(req, res){

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

            // Check for access for endpoint
            if(!utilities.verifyRole(user.roleId,'d','documents')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(req.query.documentId){
                query.documentId = req.body.documentId;
            }
            
            let values = await db.public.docs.destroy({
                where: query
            })
            if(values==0){
                res.status(200).json({
                    error:"document not found"
                });
            }else{
                res.status(200).json({
                    success: true,
                    docs: values,
                    deleted: true
                });
            }
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

async function getType(req, res){

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

            // Check for access for endpoint
            if(!utilities.verifyRole(user.roleId,'r','documents')) {
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
            //Values -> An array of objects(tupules of our result)
            let values = await db.public.docs.findAll({
                where: query
            })

            let type = {}; let j=1;
            for(let i=0;i<values.length;i++) {
                if(!Object.values(type).includes(values[i].type)) {
                    type[j++] = values[i].type;
                }
            }
            res.status(200).json({
                success: true,
                docs: type
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


module.exports = {
    create,
    get,
    destroy,
    getType
}