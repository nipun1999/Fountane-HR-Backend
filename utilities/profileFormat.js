var db = require("../models/db");


async function get() {
    let query = 'select * from profiles'
    let result = await db.public.sequelize.query(query,{
        type: db.public.sequelize.QueryTypes.SELECT
    })
    result = result.reduce((acc, obj)=>{
        let department = "Delvelopment";
        if(obj.department == "backend" || obj.department == "frontend"){
            department = "Delvelopment";
        }else{
            department = "Marketing";
        }
        acc[department] = acc[department] ? acc[department] : [];
        acc[department].push({
            "Employee Name":obj.name,
            "Employee ID":obj.empCode,
            "Employee Location":obj.branchLocation,
            "Employee Designation":obj.designation
        });
        return acc;
    }, {})
    console.log(result)
}

get()