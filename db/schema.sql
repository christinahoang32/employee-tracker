DROP DATABASE if exists employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- Tables

CREATE TABLE department (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	name VARCHAR(30) NOT NULL
	);
	
CREATE TABLE role(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INT,
	FOREIGN KEY(department_id)
	REFERENCES department (id)
	ON DELETE set NULL
);

CREATE TABLE employee(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
	FOREIGN KEY (role_id)
    REFERENCES role(id),
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employee (id)
);