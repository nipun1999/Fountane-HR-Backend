const jiraCtrl = require("../controllers/jiraCtrl")
var db = require("../models/db");

var request = require("request");

function getAllProjects() {
    var options = { method: 'GET',
  url: 'http://fountane.atlassian.net/rest/api/latest/project',
  headers: 
   { 'Postman-Token': '02afb6f2-2128-42c5-9bc1-991a5775b7ce',
     'cache-control': 'no-cache',
     Authorization: 'Basic cHJhYmhkZWVwQGZvdW50YW5lLmNvbTpXZ2RyeTVMdEZzT1JrcVBDaWx0ekI0RTA=',
     'Content-Type': 'application/json' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log("body received: ", body);
  body = JSON.parse(body)
  for(let i=0;i<body.length;i++) {
      let reqObject = {
          body : {
              project : {
                key : body[i].key,
              name : body[i].name
              }
              
          }
      }
    //   console.log(reqObject)
    // jiraCtrl.createProject(reqObject,{})
  }
});

}

function getAllIssues(projectKey) {
    return new Promise((resolve,reject) => {
        var options = { method: 'GET',
  url: 'http://fountane.atlassian.net/rest/api/latest/search',
  qs: { projectKey: projectKey },
  headers: 
   { 'Postman-Token': 'd70eb6eb-f004-4fa1-8194-5b43779586bc',
     'cache-control': 'no-cache',
     Authorization: 'Basic cHJhYmhkZWVwQGZvdW50YW5lLmNvbTpXZ2RyeTVMdEZzT1JrcVBDaWx0ekI0RTA=',
     'Content-Type': 'application/json' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
    console.log("received body: ", body);
    body =   JSON.parse(body)
    let issueArray = body.issues
    for(let i=0;i<issueArray.length;i++) {
        let aEmail = null
        if(issueArray[i].fields.assignee) {
            aEmail = issueArray[i].fields.assignee.emailAddress
        }
        let reqObject = {
            body : {
                issue_event_type_name : "issue_assigned",
                issue : {
                    id : issueArray[i].id,
                    fields : {
                        project : {
                            key : issueArray[i].fields.project.key
                        },
                        assignee : {
                            emailAddress : aEmail
                        },
                        summary : issueArray[i].fields.issuetype.name
                    }
                },
                user : {
                    emailAddress: issueArray[i].fields.reporter.emailAddress
                }
            }
        }
        // jiraCtrl.issueUpdated(reqObject,{})
        resolve('CREATED')
    }
});
    })
    
}

//Get all projects

// getAllProjects()


//Get all issues
async function issues() {
    let values = await db.public.project_jira.findAll()
    for(let project of values) {
        let res = await getAllIssues(project.projectKey)
        console.log(res)
    }
    console.log('\n\ndatabase updated')
}
issues()

// getAllProjects();