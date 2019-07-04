var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");
 
 
async function createRole(req, res){
   
 
    try {
        //
        let create_obj = {
            name: req.body.name,
            orgId: req.body.orgId
        };
 
        let role_created = await db.public.roles.create(create_obj);
 
        res.status(200).json({
            success: true,
            role: role_created
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
 
async function createPermissions(req, res){
   
 
    try {
        //
        let create_obj = {
            action: req.body.action,
            entity: req.body.entity,
            entityId: req.body.entityId
        };
 
        let perm_created = await db.public.permissions.create(create_obj);
 
        res.status(200).json({
            success: true,
            kv: perm_created
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
 
async function createRP(req, res){
   
 
    try {
        //
        let create_obj = {
            role_id: req.body.role_id,
            permission_id: req.body.permission_id
        };
 
        let rp_created = await db.public.rpObj.create(create_obj);
 
        res.status(200).json({
            success: true,
            role_prem: rp_created
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
 
async function getRoles(req, res) {
 
 
    try {
        //
        let query = {};
 
        if(req.query.id){
            query.id = req.query.id;
        }
 
        if(req.query.role_id) {
            query.role_id = req.query.role_id;
        }
 
        let values = await db.public.roles.findAll({
            where: query
        })
 
 
        res.status(200).json({
            success: true,
            roles: values
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
 
async function getPermissions(req, res) {
 
 
    try {
        //
        let query = {};
 
        if(req.query.id){
            query.id = req.query.id;
        }
 
        if(req.query.role_id) {
            query.role_id = req.query.role_id;
        }
 
        let values = await db.public.permissions.findAll({
            where: query
        })
 
 
        res.status(200).json({
            success: true,
            permissions: values
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
 
 
 
async function getRP(req, res) {
 
 
    try {
        //
        let query = {};
 
        if(req.query.id){
            query.id = req.query.id;
        }
 
        if(req.query.role_id) {
            query.role_id = req.query.role_id;
        }
 
        if(req.query.permission_id) {
            query.permission_id = req.query.permission_id;
        }
 
        let values = await db.public.rpObj.findAll({
            where: query
        })
 
 
        res.status(200).json({
            success: true,
            role_perm: values
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
    createRole,
    createPermissions,
    createRP,
    getRP,
    getRoles,
    getPermissions
}