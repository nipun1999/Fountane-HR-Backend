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
router.post('/create/leave', leavesCtrl.create);
router.get('/get/leaves', leavesCtrl.get);


// Company EndPoints
router.post('/create/company', companyCtrl.create);
router.get('/get/company', companyCtrl.get);


// Attendance EndPoints
router.post('/create/attendance',attendanceCtrl.create);
router.get('/get/attendance',attendanceCtrl.get);


//Grievance EndPoints
router.post('/create/addGrievance',grievance.createGrievances);
router.get('/get/Grievance',grievance.getGrievances);
router.post('/update/employeeGrievance',grievance.updateGrievances);

module.exports = router;
