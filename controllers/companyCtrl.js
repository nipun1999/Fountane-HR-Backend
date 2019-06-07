var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


async function create(req, res){
    

    try {
        //
        let create_obj = {
            empCode: req.body.empCode,
            companyName: req.body.companyName,
            branch: req.body.branch,
            department: req.body.department,
        };

        let companyobj_created = await db.public.companyobj.create(create_obj);

        res.status(200).json({
            success: true,
            companyobj: companyobj_created
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
        //
        let query = {};

        if(req.query.empCode){
            query.empCode = req.query.empCode;
        }

        if(req.query.branch){
            query.branch = req.query.branch;
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
    get
}