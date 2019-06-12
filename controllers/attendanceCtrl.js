var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");



async function createAttendance(req, res){
    

    try {
        //
        let create_obj = {
            empCode: req.body.empCode,
            date: req.body.date,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            comments: req.body.comments
        };
        //When employee checks in a new record will be created , checkOut will be empty but not null
        if(create_obj.empCode!="" && create_obj.date!="" && create_obj.checkIn!="") {
            let attendance_created = await db.public.attendanceobj.create(create_obj);

            res.status(200).json({
                success: true,
                attendanceobj: attendance_created
            });
        }
        else{
            res.status(500).json({
                success: false,
                error: {
                    message: "Please input value of all parameters"
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

async function updateCheckOut(req, res){
    
    let create_obj = {
        empCode : req.body.empCode ,
        checkOut : req.body.checkOut
    }
    try {
        //
        if(create_obj.empCode && create_obj.checkOut) {
            let attendance_checkout = await db.public.attendanceobj.update({checkOut : create_obj.checkOut},{
                where: {empCode: create_obj.empCode}
            });
            res.status(200).json({
                success: true,
                attendanceobj: attendance_checkout
            }); //getting returned even if there is no emp code in the table
        }
        else{
            res.status(500).json({
                success: false,
                error: {
                    message: "Please input value of all parameters"
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

async function addComment(req, res){
    
    let create_obj = {
        empCode : req.body.empCode ,
        comments : req.body.comments
    }
    try {
        //
        if(create_obj.empCode && create_obj.comments!="") {
            let attendance_comment = await db.public.attendanceobj.update({comments : create_obj.comments},{
                where: {empCode: create_obj.empCode}
            });

            res.status(200).json({
                success: true,
                attendanceobj: create_obj
            });
        }
        else{
            res.status(500).json({
                success: false,
                error: {
                    message: "Please input value of all parameters"
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

async function deleteComment(req, res){

    try {
        //
        if(req.body.empCode) {
            let attendance_delete = await db.public.attendanceobj.update({comments: ""},{
                where: {empCode: req.body.empCode}
            });

            res.status(200).json({
                success: true,
                attendanceobj: attendance_delete
            });
        }
        else{
            res.status(500).json({
                success: false,
                error: {
                    message: "Please input value of all parameters"
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


async function getEmployeeAttendance(req, res){

    try {
        //
        let query = {};

        if(req.query.empCode){
            query.empCode = req.query.empCode;
        }

        
        if(req.query.date){
            query.date = req.query.date;
        }

        let values = await db.public.attendanceobj.findAll({
            where: query
        })
        // if(Object.keys(values).length==0) Empty object condition
        res.status(200).json({
            success: true,
            attendanceobj: values
        });

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
    createAttendance,
    updateCheckOut,
    addComment,
    deleteComment,
    getEmployeeAttendance,
}