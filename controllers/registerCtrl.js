var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");


async function create(req, res){
    try {
        
        let create_obj = {
           empCode: req.body.empCode,
           fountaneEmail: req.body.fountaneEmail,
           name: req.body.name,
        };

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




module.exports = {
    create
}