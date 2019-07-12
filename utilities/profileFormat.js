var db = require("../models/db");


async function get() {
    let query = 'select * from profiles'
    let result = await db.public.sequelize.query(query,{
        type: db.public.sequelize.QueryTypes.SELECT
    })
    let m = 0;
    let d = 0;
    let ress = new Promise(async (resolve, reject)=>{
	    let tempRes = {};
	    for(let resss of result){
                let department = "Delvelopment";
                let i = 0;
                if(resss.department == "backend" || resss.department == "frontend"){
                    department = "Delvelopment";
                    d += 1;
                    i=d
                }else{
                    department = "Marketing";
                    m += 1;
                    i=m;
                }
                tempRes[department] = tempRes[department] ? tempRes[department] : [];
                let newQuery = `select distinct(project_jiras."projectName") as projectName from project_jiras inner join projects on project_jiras."projectKey" = projects."projectKey" where projects."assigneeEmail"='${resss.fountaneEmail.toLowerCase()}'`
                let newResult = await db.public.sequelize.query(newQuery,{
                    type: db.public.sequelize.QueryTypes.SELECT
                });
        console.log("newResult: ", JSON.stringify(newResult));
                newResult = JSON.parse(JSON.stringify(newResult));
                newResult = newResult.map(ressss=>{
                    return ressss.projectName
                });
                tempRes[department].push({
                    "Employee Name":resss.name,
                    "Employee ID":resss.empCode,
                    "Employee Location":resss.branchLocation,
                    "Employee Designation":resss.designation,
                    "Employee Code": `D${i}`,
                    "Employee Current Projects" : newResult
                });
	    }
            resolve(tempRes);
        });
    resultsNew = await ress;
    console.log(JSON.stringify(resultsNew));
}

get()
