var db = require("../models/db");


async function get() {
    let query = 'select * from profiles'
    let result = await db.public.sequelize.query(query,{
        type: db.public.sequelize.QueryTypes.SELECT
    })
    console.log(result)
}

get()