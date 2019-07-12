var db = require("../models/db");


async function get() {
    let query = 'select * from profiles'
    let result = await db.public.sequelize.query(query,{
        type: db.public.sequelize.QueryTypes.SELECT
    })
    let m = 0;
    let d = 0;
    result = result.reduce((acc, obj)=>{
        let department = "Delvelopment";
        let i = 0;
        if(obj.department == "backend" || obj.department == "frontend"){
            department = "Delvelopment";
            d += 1;
            i=d
        }else{
            department = "Marketing";
            m += 1;
            i=m;
        }
        acc[department] = acc[department] ? acc[department] : [];
        acc[department].push({
            "Employee Name":obj.name,
            "Employee ID":obj.empCode,
            "Employee Location":obj.branchLocation,
            "Employee Designation":obj.designation,
            "Employee Code": `D${i}`
        });
        return acc;
    }, {})
    console.log(result)
}

get()