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
    console.log("here")
    db.query('SELECT * FROM department', function (err, results) {
      if (err) {
        console.log(err);
      }
      console.table(results);
    });
  }

function viewRoles (){
        db.query(
          'SELECT roles.role_id, roles.title, roles.salary, departments.department_name FROM roles INNER JOIN departments ON roles.department_id = departments.department_id', 
          function (err,results){
            console.table(results);
          })
        }
        
function viewEmployees(){
db.query(
          `SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
          FROM employees
          INNER JOIN roles ON employees.role_id = roles.role_id
          INNER JOIN departments ON roles.department_id = departments.department_id
          LEFT JOIN employees manager ON employees.manager_id = manager.employee_id`,
          function (err,results){
            console.table(results);
          })
        }

function addDepartment(){
    db.query('INSERT INTO departments SET ?', { department_name: name }, (err, res) => {
          if (err) reject(err);
          resolve();
        })
      }

function addRole(){
    return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO roles SET ?',
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
          'INSERT INTO employees SET ?',
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
          'UPDATE employees SET role_id = ? WHERE employee_id = ?',
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
		'View ALL Departments',
		'View All Roles',
		'View All Employees',
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
	if (results.command == 'View All Departments') {
		displayDepartments();
		handleOptions();
	} else if (results == 'View All Roles') {
		viewRoles();
        handleOptions();
    } else if (results == 'View All Employees'){
        viewEmployees();
        handleOptions;
    } else if (results == 'Add a Department'){
        addDepartment();
        handleOptions;
    } else if (results == 'Add a Role'){
        addRole();
        handleOptions;
    } else if (results == 'Add an Employee'){
        addEmployee();
        handleOptions;
    } else if (results == 'Update an Employee Role'){
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