var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


async function create(req, res){
    try {
        
        let create_obj = {
           empCode: req.body.empCode,
           leaveType: req.body.leaveType,
           fromDate: req.body.fromDate,
           toDate: req.body.toDate,
           status: req.body.status
        };

        let leaves_created = await db.public.leavesobj.create(create_obj);

        res.status(200).json({
            success: true,
            leavesobj: leaves_created
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

async function get(req, res) {
    try {
        
        let query = {};

        if(req.query.empCode){
            query.empCode = req.query.empCode;
        }
        
        if(req.query.leaveType){
            query.leaveType = req.query.leaveType;
        }
        
        if(req.query.status){
            query.status = req.query.status;
        }

        let values = await db.public.leavesobj.findAll({
            where: query
        })


        res.status(200).json({
            success: true,
            kv: values
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

async function updatetrue(req,res) {
    try {
        
        let query = {};
        query.empCode = req.body.empCode;
        if (query){
            leaveUpdated = await db.public.leavesobj.update({status:true},
                { where :query 
                });
        }

        res.status(200).json({
            success : true,
            leavesobj : leaveUpdated
        });
        
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

async function updatefalse(req,res) {
    try {
        
        let query = {};
        query.empCode = req.body.empCode;
        if (query){
            leaveUpdated = await db.public.leavesobj.update({status:false},
                { where :query 
                });
        }

        res.status(200).json({
            success : true,
            leavesobj : leaveUpdated
        });
        
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
    updatetrue,
    updatefalse
}