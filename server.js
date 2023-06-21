const inquirer = require('inquirer');
const mysql = require ('mysql2');

//TODO connect to mysql database

const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

  function displayDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
    handleOptions()
  }
function viewRoles (){
  console.log('testing')
        db.query(
          'SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id', 
          function (err,results){
            console.table(results);
          });
          handleOptions()
        }
        
function viewEmployees(){
db.query(
  "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
          function (err,results){
            console.table(results);
          });
          handleOptions()
        }

// function addDepartment(){
//     db.query('INSERT INTO department SET ?', { department_name: name }, (err, res) => {
//           if (err) reject(err);
//           resolve();
//         })
//       }
// // Create a new department
// createDepartment(department) {
//   return this.connection.promise().query("INSERT INTO department SET ?", department);
// // add a department

function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ])
    .then(res => {
      let name = res;
      db.createDepartment(name)
        .then(() => console.log(`Added ${name.name} to the database`))
        .then(() => loadMainPrompts())
    })
}

      

function addRole(){
    return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO role SET ?',
          { title: title, salary: salary, department_id: departmentId },
          (err, res) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    };

function addEmployee(){
    return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO employee SET ?',
          { first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId },
          (err, res) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    };
function updateEmployeeRole(){
    return new Promise((resolve, reject) => {
        db.query(
          'UPDATE employee SET role_id = ? WHERE employee_id = ?',
          [roleId, employeeId],
          (err, res) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    };

async function handleOptions() {
	const options = [
		'View all Departments',
		'View all Roles',
		'View all Employees',
		'Add a Department',
    'Add a Role',
    'Add an Employee',
    'Update an Employee Role'
	]
	const results = await inquirer.prompt([{
		message: 'What would you like to do?',
		name: 'command',
		type: 'list',
		choices: options,
	}]);
	if (results.command == 'View all Departments') {
		displayDepartments();
		handleOptions();
	} else if (results.command == 'View all Roles') {
		viewRoles();
        handleOptions();
    } else if (results.command == 'View all Employees'){
        viewEmployees();
        handleOptions;
    } else if (results.command == 'Add a Department'){
        addDepartment();
        handleOptions;
    } else if (results.command == 'Add a Role'){
        addRole();
        handleOptions;
    } else if (results.command == 'Add an Employee'){
        addEmployee();
        handleOptions;
    } else if (results.command == 'Update an Employee Role'){
        updateEmployeeRole();
        handleOptions
    }
}
	


// Function to start the application
const startApp = async () => {
    try {
      await db.connect();
      handleOptions();
    } catch (err) {
      console.error('Error connecting to the database: ', err);
    }
};

startApp()