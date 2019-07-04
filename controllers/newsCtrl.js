var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
var FCM = require('fcm-node');
var serverKey = 'AAAAdAEE1Ic:APA91bFadkxXpAnpmvpg4iAPbmJD0DR0hzjKotxvxh1RvLwjACGG41-hT5383A-QPpP_F93Qntu8-rRk_nNMf7Rp9YPKLamnrNuKmN_2ReziWxmpXLkPMZA4BQq91vpAkxoT-x48jamX'; //put your server key here
var fcm = new FCM(serverKey);



function sendMessage(title){
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: '/topics/News',         
        notification: {
            title: 'New news at Fountane', 
            body: title 
        },
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

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
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {
            let re = await utilities.verifyRole(user.roleId,'c','news');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let create_obj = {
                empCode: req.body.empCode,
                venue : req.body.venue,
                date : req.body.date,
                text: req.body.text,
                title: req.body.title,
                imageFirebaseLink : req.body.imageFirebaseLink
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

            let newsobj_created = await db.public.news.create(create_obj);

            await sendMessage(req.body.title)

            res.status(200).json({
                success: true,
                newsobj: newsobj_created
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
                message: "Please enter all fields",
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

            // Check for access for endpoint
            let re = await utilities.verifyRole(user.roleId,'r','news');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if (req.query.newsId){
                query.newsId = req.query.newsId;
            }

            // if(req.query.empCode){
            //     query.empCode = req.query.empCode;
            // }

            // if(req.query.title){
            //     query.title = req.query.title;
            // }

            // if(req.query.text){
            //     query.text = req.query.text;
            // }

            let values = await db.public.news.findAll({
                where: query
            })


            res.status(200).json({
                success: true,
                newsobj: values
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

            // Check for access for endpoint
            let re = await utilities.verifyRole(user.roleId,'u','news');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(req.body.newsId) {
                query.newsId = req.body.newsId;
            }
            
            else {
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Please provide us newsId"
                    }
                });
                return;
            }
            console.log(query)


            let newsUpdate={}
            if(query) {

                let key = req.body;
                console.log(key)
                // for(let obj in key)
                // {
                    // console.log(obj);
                    // let value = key[obj];
                    newsUpdate = await db.public.news.update(key,
                        { 
                            where :query
                        }
                    );
                    
                // }
            }
            
            res.status(200).json({
                success : true,
                newsupdateObj : newsUpdate
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
            let re = await utilities.verifyRole(user.roleId,'d','news');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if(req.body.newsId){
                query.newsId = req.body.newsId;
            }

            else {
                res.status(500).json({
                    status : false,
                    message : "newsId not provided"
                });
                return;
            }
            
            let values = await db.public.news.destroy({
                where: query
            })
            if(values==0){
                res.status(200).json({
                    error:"news piece not found"
                });
            }else{
                res.status(200).json({
                    success: true,
                    news: values,
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


module.exports = {
    create,
    get,
    update,
    destroy
}