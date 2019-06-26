var db = require("../models/db");
var config = require("../config/config");

async function verifyRole(user_credentials, entity, entity_id, org_id){

    console.log(user_credentials);
 





    // return {
    //     success: is_allowed,
    //     role: role
    // };
}

function main(){
    console.log("this is from main");
}

module.exports = {
    verifyRole: verifyRole
};
