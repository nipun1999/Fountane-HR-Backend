var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");



async function create(req, res){
    

    try {
        //
        let create_obj = {
            empCode: req.body.empCode,
            date: req.body.date,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            comments: req.body.comments
        };

        let attendance_created = await db.public.attendanceobj.create(create_obj);

        res.status(200).json({
            success: true,
            attendanceobj: attendance_created
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

async function get(req, res){

    try {
        //
        let query = {};

        if(req.query.key){
            query.key = req.query.key;
        }

        let values = await db.public.attendanceobj.findAll({
            where: query
        })


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
//Add update,delete comment
async function updateComment(req, res){
    
}
async function deleteComment(req, res){
    
}

module.exports = {
    create,
    get,
    updateComment,
    deleteComment
}
