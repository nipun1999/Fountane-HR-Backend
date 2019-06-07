var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");

async function createGrievances(req,res) {
    try {
        //
        let create_obj = {
            description: req.body.description,
            status: false,
            empCode: req.body.empCode
        };

        
        if(req.body.description!=""&&req.body.employeeId!=""){
            let grievance_created = await db.public.grievances.create(create_obj);

            res.status(200).json({
                success: true,
                grievance: grievance_created
            });
        }else{
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


async function getEmployeeGrievances(req, res) {


    try {
        //
        let query = {};

        if(req.query.empCode){
            query.empCode = req.query.empCode;
            let grievances = await db.public.grievances.findAll({
                where: query
            })
    
            res.status(200).json({
                success: true,
                grievance: grievances
            });
        }else{
            res.status(500).json({
                success: false,
                error: {
                    message: "Please give employee ID as a parameter",
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


async function getEmployeeResolvedGrievances(req, res) {


    try {
        //
        let query = {};

        query.status = true
        let grievances = await db.public.grievances.findAll({
                where: query
        })

        res.status(200).json({
                success: true,
                grievance: grievances
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

async function getEmployeePendingGrievances(req, res) {


    try {
        //
        let query = {};

        query.status = false
        let grievances = await db.public.grievances.findAll({
                where: query
        })

        res.status(200).json({
                success: true,
                grievance: grievances
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


async function updateGrievances(req,res) {
    try {
        //
        let query = {};
        query.grievanceId = req.body.grievanceId;
        if (query){
            grievanceUpdate = await db.public.grievances.update({status:true},
                { where :query 
                });
        }

        res.status(200).json({
            success : true,
            grievance : grievanceUpdate
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
    createGrievances,
    getEmployeeGrievances,
    getEmployeeResolvedGrievances,
    getEmployeePendingGrievances,
    updateGrievances
}