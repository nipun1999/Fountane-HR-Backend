var express = require('express');
var router = express.Router();

// var themes = require("../controllers/themeCtrl");
// var atcStrip = require("../controllers/atcStripCtrl");
var login = require("../controllers/loginCtrl");
// var atc = require("../controllers/atc-strips-no-cache");
var crud = require("../controllers/crud");
var grievance = require("../controllers/grievanceCtrl");
var leavesCtrl = require("../controllers/leavesCtrl");
var companyCtrl = require("../controllers/companyCtrl");
var attendanceCtrl = require("../controllers/attendanceCtrl");

var profile = require("../controllers/profileCtrl");

var docsCtrl = require("../controllers/docsCtrl");

// // Login and onboarding
// router.post("/register", login.register);
// router.post("/login", login.login);


// // ATC and the ATC Strips
// router.get('/atc/strips', atc.getAll);
// router.get('/atc/progress/strip', atc.get);
// router.post('/atc/strip/create', atc.create);
// router.delete('/atc/strip/delete', atc.delete);

// router.post("/request/permission", login.requestPermission);
// router.post("/grant/permission", login.allotPermission);
// router.get("/get/user/team", login.getUserTeams);
// router.get('/search/user', login.userFullTs);

router.post('/create/kv', crud.create);
router.get('/get/kv', crud.get);


//Leaves EndPoints
router.post('/leaves/create', leavesCtrl.create);
router.get('leaves/get', leavesCtrl.get);
router.post('leaves/updateTrue',leavesCtrl.updateTrue);
router.post('leaves/updateFalse',leavesCtrl.updateFalse);



// Company EndPoints
router.post('/create/company', companyCtrl.create);
router.get('/get/company', companyCtrl.get);


// Attendance EndPoints
router.post('/create/attendance',attendanceCtrl.createAttendance);
router.post('/updateCheckOut/attendance',attendanceCtrl.updateCheckOut);
router.post('/addComment/attendance',attendanceCtrl.addComment);
router.post('/updateComment/attendance',attendanceCtrl.addComment);
router.post('/deleteComment/attendance',attendanceCtrl.deleteComment);
router.get('/getByEmp/attendance',attendanceCtrl.getEmployeeAttendanceByCode);
router.get('/getByDate/attendance',attendanceCtrl.getEmployeeAttendanceByDate);
router.get('/getByCodeAndDate/attendance',attendanceCtrl.getByCodeAndDate);

//Grievance EndPoints
router.post('/create/addGrievance',grievance.createGrievances);
router.get('/get/Grievance',grievance.getGrievances);
router.post('/update/employeeGrievanceTrue',grievance.updateGrievancesTrue);
router.post('/update/employeeGrievanceFalse',grievance.updateGrievancesFalse);


//Profile EndPoints
router.post('/create/employeeProfile',profile.createProfile);
router.post('/update/employeeProfile',profile.updateProfile);
router.get('/get/employeeProfile',profile.getProfile);



//Documents EndPoints
router.post('/create/documents',docsCtrl.create);
router.get('/get/documents',docsCtrl.get);


module.exports = router;


