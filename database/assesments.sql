CREATE DATABASE IF NOT EXISTS student;
USE student;
CREATE TABLE assessments
(   id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    weight DECIMAL(5,2),
    difficulty INT,
    estimated_hours DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES student_data(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);