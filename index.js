const mysql = require('mysql2');
const inquirer = require('inquirer');
const { log } = require('console');
const { ifError } = require('assert');
require('console.table')

// create the connection to mysql

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'securepwd',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker database.`)
);


// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

function start() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'choice',
                choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role',
                    'exit'
                ],
            }
        ]).then((answer) => {
            // console.log(answer);
            switch (answer.choice) {
                case 'view all departments':
                    allDepts()
                    break;
                case 'view all roles':
                    allRoles()
                    break;
                case 'view all employees':
                    allEmployees()
                    break;
                case 'add a department':
                    addDepartment()
                    break;
                case 'add a role':
                    addRole()
                    break;
                case 'add an employee':
                    addEmployee()
                    break;
                case 'update an employee role':
                    updateEmployee()
                    break;


                default:
                    process.exit()
                    break;
            }
        })

}

function allDepts() {
    // WHEN I choose to view all departments
    // THEN I am presented with a formatted table showing department names and department ids
    db.query(`SELECT * FROM department`, function (err, results) {
        console.log('--- ALL DEPARTMENTS ---');
        console.table(results);
        console.log('-----------------------');
        start()
    });
};

function allRoles() {


    // WHEN I choose to view all roles
    // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

    db.query(`SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id`, function (err, results) {
        console.log('--- ALL ROLES ---');
        console.table(results);
        console.log('-----------------------');
        start()
    });


};

function allEmployees() {

    // WHEN I choose to view all employees
    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.first_name as managerFirstName, manager.last_name as managerLastName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id `, function (err, results) {
        console.log('--- ALL EMPLOYEES ---');
        console.table(results);
        console.log('-----------------------');
        start()

    });


};

function addDepartment() {

    // WHEN I choose to add a department
    // THEN I am prompted to enter the name of the department and that department is added to the database
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter the name of the department you want to add to the database."
        }
    ])
        .then((answer) => {
            console.log(answer);

            const sql = `INSERT INTO department (name)
            VALUES (?)`;
            const params = [answer.name];
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('The new department entered has been added successfully to the database.');
            });
        });
};


function addRole() {
    // WHEN I choose to add a role
    // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

    db.query(`SELECT * FROM department`, function (err, results) {

        const departmentList = results.map((depts) => ({
            name: depts.name,
            value: depts.id
        }))

        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the role name"
            },
            {
                type: "input",
                name: "salary",
                message: "Enter role salary"
            },
            {
                type: "list",
                name: "department_id",
                message: "Enter department id for in which the role will be in",
                choices: departmentList

            }
        ]).then((answer) => {

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [answer.title, answer.salary, answer.department_id]
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('The new role entered has been added successfully to the database.');

                start()
            });

        });
    });


};

function addEmployee() {

    //WHEN I choose to add an employee
    //THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database 
    //is inquirer.prompt a method?
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"

        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the id of the employees role?"

        },
        {
            type: "input",
            name: "manager_id",
            message: "If they have a managaer, what is the manager's id?"

        }

    ])
        .then((answer) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
            const params = [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]

            db.query(sql, params, function (err, results) {

                console.log("Employee added!")

            });
            db.query(`SELECT * FROM employee`, function (err, results) {
                console.table(results);
            })


        });




};

function updateEmployee() {

    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    // I could add to update new manager as well
    inquirer.prompt([
        {
            type: "input",
            name: "last_name",
            message: "enter the employee's last name of whom you want to update their role"
        },
        {
            type: "input",
            name: "role_id",
            message: "enter id of the new role for the employee."
        }
    ])
        .then((answers) => {
            const sql = `UPDATE employee SET role_id = ? WHERE last_name = ?`;
            const params = [answers.role_id, answers.last_name];
            db.query(sql, params, function (err, results) {
                if (err) throw err;
                console.table(results);
                console.log('The employee role has been updated.');
            })




            db.query(`SELECT * FROM employee`, function (err, results) {
                console.table(results);
            })
        });

};

start()