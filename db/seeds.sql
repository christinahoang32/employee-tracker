INSERT INTO department (name)
VALUES ("Shoes"),
       ("Women"),
       ("Men"),
       ("Children"),
       ("Household");

INSERT INTO role (title, salary,department_id)
VALUES ("manager", 100000, 1),
       ("intern", 30000, 2),
       ("employee", 50000, 3);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ("Christina", "Hoang", 1, NULL),
       ("Michael", "Jackson", 2, 2),
       ("Billie", "Eilish", 3, 2),
       ("John", "Smith", 2, 2)
