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
        let newQuery = `select distinct(project_jiras."projectName") as projectName from project_jiras inner join projects on project_jiras."projectKey" = projects."projectKey" where projects."assigneeEmail"=${obj.fountaneEmail}`
        let newResult = await db.public.sequelize.query(newQuery,{
            type: db.public.sequelize.QueryTypes.SELECT
        })
        acc[department].push({
            "Employee Name":obj.name,
            "Employee ID":obj.empCode,
            "Employee Location":obj.branchLocation,
            "Employee Designation":obj.designation,
            "Employee Code": `D${i}`,
            "Employee Current Projects" : newResult
        });
        return acc;
    }, {})
    console.log(result)
}

get()