const inquirer = require('inquirer');
const mysql = require('mysql2');

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
function viewRoles() {
  console.log('testing')
  db.query(
    'SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id',
    function (err, results) {
      console.table(results);
    });
  handleOptions()
}

function viewEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
    function (err, results) {
      console.table(results);
    });
  handleOptions()
}
function addDepartment() {
  inquirer.prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ])
    .then(res => {
      let name = res;
      db.query(`INSERT INTO department (name) VALUES('${res.name}') `, function (err, results) {
        if (err) {
          console.log(err);
        }
        console.log(`added ${res.name} to the departments`);
        handleOptions()
      });
    })
}



function findAllDepartments() {
  return db
    .promise()
    .query("SELECT department.id, department.name FROM department;");
}


function addRole() {
  findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "title",
          message: "What is the title of the role?",
        },
        {
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department does the role belong to?:",
          choices: departmentChoices,
        },
      ])
      .then((res) => {
        console.log(res);
        db.query(
          "INSERT INTO role SET ?",
          {
            title: res.title,
            salary: res.salary,
            department_id: res.department,
          },
          function (err, results) {
            if (err) {
              console.log(err);
            }
            console.log('added ${res.title} to the database');
            handleOptions();
          }
        );
      });
  });
}

function findAllEmployees() {
  return db
    .promise()
    .query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id  FROM employee;");
}

function findAllRoles() {
  return db
    .promise()
    .query(
      'SELECT role.id, role.title FROM role INNER JOIN department ON role.department_id = department.id;'
    );
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        message: "What is the employee's first name?",
      },
      {
        name: 'last_name',
        message: "What is the employee's last name?",
      },
    ])
    .then((res) => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      findAllRoles().then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt({
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roleChoices,
          })
          .then((res) => {
            let roleId = res.roleId;

            findAllEmployees().then(([rows]) => {
              let employees = rows;
              const managerChoices = employees.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );

              managerChoices.unshift({ name: 'None', value: null });

              inquirer
                .prompt({
                  type: 'list',
                  name: 'managerId',
                  message: "Who is the employee's manager?",
                  choices: managerChoices,
                })
                .then((res) => {
                  let employee = {
                    manager_id: res.managerId,
                    role_id: roleId,
                    first_name: firstName,
                    last_name: lastName,
                  };

                  return db
                    .promise()
                    .query('INSERT INTO employee SET?', employee);
                })
                .then(() =>
                  console.log(`Added ${firstName} ${lastName} to the database`)
                )
                .then(() => handleOptions());
            });
          });
      });
    });
}

function updateEmployeeRole() {
  findAllRoles().then(([rows]) => {
    let roles = rows;
    var roleChoices = roles.map(({ roleId, title }) => ({
      name: title,
      value: roleId,
    }));
    findAllEmployees().then(([rows]) => {
      let employees = rows;
      var employeeChoices = employees.map(
        ({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        })
      );

      inquirer
        .prompt([
        {
          type: 'list',
          name: 'id',
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }, {
          type: 'list',
          name: 'roleId',
          message: "Which role do you want to assign the selected employee?",
          choices: roleChoices,
        }
      ],
    )
      .then((res) => {
        return db
          .promise()
          .query('UPDATE employee SET role_id = ? where id = ?', [roleId, id]);
      })
      .then((res) =>
        console.log(`Updates employee's role`, res)
      )
      .then(() => handleOptions());
  });
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
  } else if (results.command == 'View all Employees') {
    viewEmployees();
    handleOptions;
  } else if (results.command == 'Add a Department') {
    addDepartment();
    handleOptions;
  } else if (results.command == 'Add a Role') {
    addRole();
    handleOptions;
  } else if (results.command == 'Add an Employee') {
    addEmployee();
    handleOptions;
  } else if (results.command == 'Update an Employee Role') {
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