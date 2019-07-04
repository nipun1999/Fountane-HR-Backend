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
            title: 'New Event at Fountane', 
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

async function createEvent(req,res) {
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
            let re = await utilities.verifyRole(user_credentials.roleId,'c','events');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let create_obj = {
                empCode : req.body.empCode,
                name : req.body.name,
                eventDate : req.body.eventDate,
                eventVenue : req.body.eventVenue
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


            valid = await db.public.register.findOne({
                where : {empCode : req.body.empCode}
            })

            if (!valid){
                res.status(500).json({
                    success : false,
                    message : "Empcode does not exist"
                });
                return ;
            }

            if (req.body.imageFirebaseLink){
                create_obj.imageFirebaseLink = req.body.imageFirebaseLink;
            }




            try{
                await sendMessage(req.body.name)
                let eventCreate = await db.public.events.create(create_obj);
                res.status(200).json({
                    success: true,
                    events : eventCreate
                });
            }
            catch(err) {
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Error in Making the event"
                    }
                });
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


async function getEvent(req, res) {
    
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
            let re = await utilities.verifyRole(user_credentials.roleId,'r','events');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if (req.query.eventId){
                query.eventId = req.query.eventId;
            }

            if(req.query.empCode){
                query.empCode = req.query.empCode;
            }
            
            if (req.query.name){
                query.name = req.query.name;
            }

            if (req.query.eventDate){
                query.eventDate = req.query.eventDate;
            }

            if (req.query.eventVenue){
                query.eventVenue = req.query.eventVenue;
            }

            let getEvent = await db.public.events.findAll({
                where: query
            })
    
            res.status(200).json({
                success: true,
                events : getEvent
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

async function updateEvent(req, res) {
    
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
            let re = await utilities.verifyRole(user_credentials.roleId,'u','events');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if (req.body.eventId){
                query.eventId = req.body.eventId;
            }

            else {
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Event Id not provided",
                    }
                });
                return;
            }

            let updateEvent = await db.public.events.findOne({
                where: query
            })

            if (updateEvent){

                let update_obj = {
                    empCode : req.body.empCode,
                    name : req.body.name,
                    eventDate : req.body.eventDate,
                    eventVenue : req.body.eventVenue
                };
            
                if (req.body.imageFirebaseLink){
                    update_obj.imageFirebaseLink = req.body.imageFirebaseLink;
                }

                try{
                    let eventUpdate = await db.public.events.update(update_obj,{
                        where : query
                    });
                    res.status(200).json({
                        success: true,
                        events : eventUpdate
                    });
                }
                catch(err) {
                    res.status(200).json({
                        success : false,
                        error : {
                            message : "Error in updating the event"
                        }
                    });
                }
            }
            else {
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Event not found",
                    }
                });
                return;
            }
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


async function deleteEvent(req, res) {
    
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
            let re = await utilities.verifyRole(user_credentials.roleId,'d','events');
            if(re) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }

            let query = {};

            if (req.body.eventId){
                query.eventId = req.body.eventId;
            }

            else {
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Event Id not provided",
                    }
                });
                return;
            }

            let deleteEvent = await db.public.events.findOne({
                where: query
            })

            if (deleteEvent){

                try{
                    let eventDelete = await db.public.events.destroy({
                        where : query
                    });
                    res.status(200).json({
                        success: true,
                        events : eventDelete
                    });
                }
                catch(err) {
                    res.status(200).json({
                        success : false,
                        error : {
                            message : "Error in deleting the event"
                        }
                    });
                }
            }
            else {
                res.status(500).json({
                    success : false,
                    error : {
                        message : "Event not found",
                    }
                });
                return;
            }
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
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent
}