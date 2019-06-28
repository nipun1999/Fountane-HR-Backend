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
 
                if(!utilities.verifyRole(user.roleId,'c','attendances')) {
                    res.status(500).json({
                        success : false,
                        message : "Permissions not available"
                    });
                    return;
                }
               
                let create_obj = {
                    empCode: req.body.empCode,
                    date: req.body.date,
                    checkIn: req.body.checkIn,
                };
 
                for (var i in create_obj){
                    if (!create_obj[i]){
                        console.log("No "+ i)
                        res.status(500).json({
                            success : false,
                            message : i + " is a required field"
                        });
                        return;
                    }  
                }
 
                let value = await db.public.register.findOne({
                    where : {empCode : req.body.empCode}
                })
 
                if (!value){
                    res.status(500).json({
                        success : false,
                        message : "Employee code provided does not exist"
                    });
                    return;
                }
 
                try {
                    let attendance_created = await db.public.attendanceobj.create(create_obj);
                    let status_true = await db.public.profiles.update(
                        {status:true , attendanceId:attendance_created.attendanceId},{where : {empCode:create_obj.empCode} }
                    );
                    res.status(200).json({
                        success : true,
                        attendanceobj : attendance_created
                    });
 
                }
                catch(err){
                    console.log(err);
                    res.status(500).json({
                        success : false,
                        description : err.description
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
                return ;
           }
 
       
 
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
async function updateCheckOut(req, res){
   
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
 
 
            if(!utilities.verifyRole(user.roleId,'u','attendances')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
 
            let create_obj = {
                attendanceId : req.body.attendanceId,
                checkOut : req.body.checkOut
            }
            create_obj.attendanceId = parseInt(create_obj.attendanceId)
 
            for (var i in create_obj){
                if (!create_obj[i]){
                    console.log("No "+i);
                    res.status(500).json({
                        success : false,
                        message : i + " is a required field"
                    });
                    return;
                }
            }
 
            let value = await db.public.attendanceobj.findOne({
                where : {attendanceId : req.body.attendanceId}
            })
 
            if (!value){
                res.status(500).json({
                    success : false,
                    message : "Attendance Id does not exist"
                });
                return;
            }
 
            try {
                let attendance_checkout = await db.public.attendanceobj.update({checkOut : create_obj.checkOut},{
                    where : {attendanceId : create_obj.attendanceId}
                })
                let status_false = await db.public.profiles.update({status:false},{where : {empCode:user.empCode} });
 
 
                res.status(200).json({
                    success : true,
                    attendanceobj : attendance_checkout
                })
            }
            catch (err){
                console.log(err);
                res.status(500).json({
                    success : false,
                    description : err.description
                })
            }
   
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
            return ;
        }      
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Server Error",
                description: err.description
            }
        });
    }
 
}
 
async function addComment(req, res){
 
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
 
 
            if(!utilities.verifyRole(user.roleId,'c','attendances')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
 
            let create_obj = {
                attendanceId : req.body.attendanceId,
                comments : req.body.comments
            }
 
            for (var i in create_obj){
                if (!create_obj[i]){
                    console.log("No "+i);
                    res.status(500).json({
                        success : false,
                        message : i + " is a required field"
                    });
                    return ;
                }
            }
 
            let value = await db.public.attendanceobj.findOne({
                where : {attendanceId : req.body.attendanceId}
            })
 
            if (!value){
                res.status(500).json({
                    success : false,
                    message : "Attendance Id does not exist"
                });
                return
            }
 
            try {
                let comment = await db.public.attendanceobj.update({comments : create_obj.comments},{
                    where : {attendanceId : create_obj.attendanceId}
                });
 
                res.status(200).json({
                    success : true,
                    attendanceobj : comment
                })
            }
            catch(err){
                console.log(err);
                res.status(500).json({
                    success : false,
                    message : "Error in Entering to the database",
                    description : err.description
                })
            }
        }
        else {
            res.status(500).json({
                success: false,
                error: {
                    message: "Token not found"
                }
            });
            return;
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
 
 
            if(!utilities.verifyRole(user.roleId,'r','attendances')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
 
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
            return ;
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
 
 
            if(!utilities.verifyRole(user.roleId,'r','attendances')) {
                res.status(500).json({
                    success : false,
                    message : "Permissions not available"
                });
                return;
            }
           
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
    getEmployeeAttendance,
    getAttendanceByMonth
}