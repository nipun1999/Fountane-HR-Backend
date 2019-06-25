'use strict'

const Sequelize = require('sequelize');
var config = require("../../config/config");

var env = config.db.env;

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  schema: env.SCHEMA,
  define: {
    underscored: true
  },
  // socketPath : env.SOCKET_PATH,
  // dialectOptions: env.DIALECT_OPTIONS
//  logging: false
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Sequelize.Op;

//Models/tables
db.permissions = require('./permissions.js')(sequelize, Sequelize);
db.grievances = require('./grievances.js')(sequelize, Sequelize);
db.leavesobj = require('./leaves.js')(sequelize,Sequelize);
db.companyobj = require('./company.js')(sequelize,Sequelize);
db.attendanceobj = require('./attendance.js')(sequelize,Sequelize);
db.register = require('./register.js')(sequelize,Sequelize);

db.news = require('./news.js')(sequelize,Sequelize);

db.profiles = require('./profile.js')(sequelize,Sequelize);

db.login = require('./login.js')(sequelize,Sequelize);

db.docs = require('./documents.js')(sequelize,Sequelize);

db.signInObj = require('./signIn.js')(sequelize,Sequelize);
db.team = require('./team.js')(sequelize,Sequelize);
db.events = require('./events.js')(sequelize,Sequelize);

db.roles = require('./roles.js')(sequelize,Sequelize)
db.permissions = require('./permissions.js')(sequelize,Sequelize)
db.rpObj = require('./roles_permissions.js')(sequelize,Sequelize)

//Relations
// db.profile.belongsTo(db.login, {onDelete: "CASCADE"});

module.exports = db;
