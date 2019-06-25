var db = require("../models/db");
var config = require("../config/config");
var utilities = require("../utilities/utilities");



async function createAttendance(req, res){
    

    try {


        var authTOKEN = req.header('X-AUTH-TOKEN');
            if(authTOKEN == "" || authTOKEN == null)
            {
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Token not passed"
                    }
                });
            }
        
           try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
           }
           catch(err){
                res.status(500).json({
                    success: false,
                    error: {
                        message: "invalid Token"
                    }
                });
           }

           if(user) {
                        //
                let create_obj = {
                    empCode: req.body.empCode,
                    date: req.body.date,
                    checkIn: req.body.checkIn,
                    checkOut: req.body.checkOut,
                    comments: req.body.comments
                };
                //When employee checks in a new record will be created , checkOut will be empty but not null
                if(create_obj.empCode!="" && create_obj.date!="" && create_obj.checkIn!="") {
                    let attendance_created = await db.public.attendanceobj.create(create_obj);

                    res.status(200).json({
                        success: true,
                        attendanceobj: attendance_created
                    });
                }
                else{
                    res.status(500).json({
                        success: false,
                        error: {
                            message: "Please input value of all parameters"
                        }
                    });
                }
           }
           else {
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Token not found"
                    }
                });
           }

        

    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please put all body parameters",
                description: err.description
            }
        });
    }

}

           

           





async function updateCheckOut(req, res){
    
    let create_obj = {
        empCode : req.body.empCode ,
        checkOut : req.body.checkOut
    }
    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {
            if(create_obj.empCode && create_obj.checkOut) {
                let attendance_checkout = await db.public.attendanceobj.update({checkOut : create_obj.checkOut},{
                    where: {empCode: create_obj.empCode}
                });
                res.status(200).json({
                    success: true,
                    attendanceobj: attendance_checkout
                }); //getting returned even if there is no emp code in the table
            }
            else{
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Please input value of all parameters"
                    }
                });
            }    
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
        }      
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please put all body parameters",
                description: err.description
            }
        });
    }

}

async function addComment(req, res){
    
    let create_obj = {
        empCode : req.body.empCode ,
        comments : req.body.comments
    }
    try {
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {
            if(create_obj.empCode && create_obj.comments!="") {
                let attendance_comment = await db.public.attendanceobj.update({comments : create_obj.comments},{
                    where: {empCode: create_obj.empCode}
                });
    
                res.status(200).json({
                    success: true,
                    attendanceobj: create_obj
                });
            }
            else{
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Please input value of all parameters"
                    }
                });
            }
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
        }
        //
        

    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please put all body parameters",
                description: err.description
            }
        });
    }

}

async function deleteComment(req, res){

    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {
            if(req.body.empCode) {
                let attendance_delete = await db.public.attendanceobj.update({comments: ""},{
                    where: {empCode: req.body.empCode}
                });
    
                res.status(200).json({
                    success: true,
                    attendanceobj: attendance_delete
                });
            }
            else{
                res.status(500).json({
                    success: false,
                    error: {
                        message: "Please input value of all parameters"
                    }
                });
            }    
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
        }
        
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Please put all body parameters",
                description: err.description
            }
        });
    }

}


async function getEmployeeAttendance(req, res){

    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {
            let query = {};

            if(req.query.empCode){
                query.empCode = req.query.empCode;
            }

            
            if(req.query.date){
                query.date = req.query.date;
            }

            let values = await db.public.attendanceobj.findAll({
                where: query
            })
            // if(Object.keys(values).length==0) Empty object condition
            res.status(200).json({
                success: true,
                attendanceobj: values
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
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

var getDays = function(month,year) {
    return new Date(year,month,0).getDate()
}

async function getAttendanceByMonth(req, res){

    try {
        //
        var authTOKEN = req.header('X-AUTH-TOKEN');
        if(authTOKEN == "" || authTOKEN == null) {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not passed"
                }
            });
        }
        try{
            var user = utilities.decryptJWTWithToken(authTOKEN)
        }    
        catch{
            res.status(500).json({
                success: false,
                error: {
                    message: "invalid Token"
                }
            });    
        }
        if(user) {
            let query = {};

            if(req.query.empCode){
                query.empCode = req.query.empCode;
            }

            if(req.query.month){
                query.month = req.query.month;
            }

            if(req.query.year) {
                query.year = req.query.year;
            }

            let result = {}
            let startDate = query.year+'-'+query.month+'-01' , endDate = query.year+'-'+query.month+'-'+getDays(query.month,query.year)
            

            let values = await db.public.attendanceobj.findAll({
                where: {
                    empCode : req.query.empCode ,
                    date : {
                        [db.public.Op.between] : [startDate,endDate]
                    }
                } 
            })
            // console.log(values[0].date)
            // let arr = values[0]
            for(let i=0;i<values.length;i++) {
                let dates = ((values[i].date).substring(8)) //extracting dates
                result[dates] = "present"
            }

            let values2 = await db.public.leavesobj.findAll({
                where : {
                    empCode : req.query.empCode ,
                    status : true ,
                    fromDate :{
                        [db.public.Op.between] : [startDate,endDate]
                    }
                }
            })
            
            for(let i=0;i<values2.length;i++) {
                let dates = ((values2[i].fromDate).substring(8)) //extracting dates
                let mon = ((values2[i].toDate).substring(5,7))
                result[dates] = values2[i].leaveType;
                
                if(parseInt(mon) === parseInt(req.query.month)) {
                    for(let j=parseInt(dates)+1;j<=parseInt((values2[i].toDate).substring(8));j++) {
                        result[j] = values2[i].leaveType;
                    }
                }
                else {
                    //toDate can be in next month from the given month
                    for(let j=parseInt(dates)+1;j<=parseInt(endDate.substring(8));j++) {
                        result[j] = values2[i].leaveType;
                    }
                }
            }
            // 02-25   03-15
            let values3 = await db.public.leavesobj.findAll({
                where : {
                    empCode : req.query.empCode ,
                    status : true ,
                    toDate :{
                        [db.public.Op.between] : [startDate,endDate]
                    }
                }
            })

            for(let i=0;i<values3.length;i++) {
                let fromMonth = ((values3[i].fromDate).substring(5,7))
                if(parseInt(fromMonth) < req.query.month) {
                    for(let j=1;j<=(values3[i].toDate).substring(8);j++) {
                        result[j] = values3[i].leaveType;
                    }
                }
            }
            //result -> unordered
            res.status(200).json({
                success: true,
                attendanceobj: result
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
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
    createAttendance,
    updateCheckOut,
    addComment,
    deleteComment,
    getEmployeeAttendance,
    getAttendanceByMonth
}