INSERT INTO department(name)
values ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
values ("Sr. Software Engineer", 120000, 1),
        ("Jr. Software Engineer", 120000, 1),
        ("Account Manager", 160000, 2),
        ("Accountant", 125000, 2),
        ("Legal Team Lead", 250000, 3),
        ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
values ("Jon", "Amaya", 1, NULL),
        ("Vinnie", "Lopez", 2, 1),
        ("Joe", "Louis", 3, NULL),
        ("Bill", "Smith", 4, 3),
        ("Victoria", "Moreno", 5, NULL),
        ("Erick", "Johnson", 6, 5);

