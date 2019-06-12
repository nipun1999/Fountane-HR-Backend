var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");



async function create(req, res){
    

    try {
        //
        let create_obj = {
            empCode: req.body.empCode,
            documentId: req.body.documentId,
            name: req.body.name,
            type: req.body.type,
            firebaseLink: req.body.firebaseLink
        };

        let documentsCreated = await db.public.docs.create(create_obj);

        res.status(200).json({
            success: true,
            docs: documentsCreated
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

        if(req.query.empCode){
            query.empCode = req.query.empCode;
        }

        let values = await db.public.docs.findAll({
            where: query
        })


        res.status(200).json({
            success: true,
            docs: values
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

async function destroy(req, res){

    try {
        //
        let query = {};

        if(req.query.documentId){
            query.documentId = req.query.documentId;
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
    destroy
}