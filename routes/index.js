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
var signInCtrl = require("../controllers/signInCtrl");
var registerCtrl = require("../controllers/registerCtrl")
var loginCtrl = require("../controllers/loginCtrl");
var profile = require("../controllers/profileCtrl");
var teamCtrl = require("../controllers/teamCtrl");
var docsCtrl = require("../controllers/docsCtrl");
var newsCtrl = require("../controllers/newsCtrl");
var eventCtrl = require("../controllers/eventCtrl");

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

router.post('/login',loginCtrl.login);
//Leaves EndPoints
router.post('/leaves/create', leavesCtrl.create);
router.get('leaves/get', leavesCtrl.get);
router.post('leaves/updateTrue',leavesCtrl.updateTrue);
router.post('leaves/updateFalse',leavesCtrl.updateFalse);



// Company EndPoints
router.post('/create/company', companyCtrl.create);
router.get('/get/company', companyCtrl.get);
router.post('/update/company',companyCtrl.update);


// Attendance EndPoints
router.post('/create/attendance',attendanceCtrl.createAttendance);
router.post('/updateCheckOut/attendance',attendanceCtrl.updateCheckOut);
router.post('/addComment/attendance',attendanceCtrl.addComment);
router.post('/updateComment/attendance',attendanceCtrl.addComment);
router.post('/deleteComment/attendance',attendanceCtrl.deleteComment);
router.get('/get/attendance',attendanceCtrl.getEmployeeAttendance);

//Attendance & Leaves
router.get('/getByMonth',attendanceCtrl.getAttendanceByMonth);

//Grievance EndPoints
router.post('/create/addGrievance',grievance.createGrievances);
router.get('/get/Grievance',grievance.getGrievances);
router.post('/update/employeeGrievanceTrue',grievance.updateGrievancesTrue);
router.post('/update/employeeGrievanceFalse',grievance.updateGrievancesFalse);

//SignIn EndPoints
router.post('/checkUser/signIn',signInCtrl.checkUser);
router.post('/checkUser/signInGoogle',signInCtrl.checkUserGoogle);

//Registration Endpoints
router.post('/register',registerCtrl.create);
router.post('/signup',registerCtrl.signup);

//Profile EndPoints
router.post('/create/employeeProfile',profile.createProfile);
router.post('/update/employeeProfile',profile.updateProfile);
router.get('/get/employeeProfile',profile.getProfile);



//Documents EndPoints
router.post('/create/documents',docsCtrl.create);
router.get('/get/documents',docsCtrl.get); // Get all documents in a type or Get all documents of an user
router.get('/get/type/documents',docsCtrl.getType) // Get all types of a document
router.delete('/delete/documents',docsCtrl.destroy);


// Team Endpoints
router.post('/create/teamMember',teamCtrl.createTeamMember);
//router.get('/get/teamLead',teamCtrl.getTeamLead);
router.get('/get/teamMember',teamCtrl.getTeamMember);

//News Endpoints

router.post('/create/news',newsCtrl.create);
router.get('/get/news',newsCtrl.get);
router.post('/update/news',newsCtrl.update);
router.post('/delete/news',newsCtrl.destroy);
// Events Endpoints
router.post('/create/event',eventCtrl.createEvent);
router.post('/update/event',eventCtrl.updateEvent);
router.post('/delete/event',eventCtrl.deleteEvent);
router.get('/get/event',eventCtrl.getEvent);

module.exports = router;


