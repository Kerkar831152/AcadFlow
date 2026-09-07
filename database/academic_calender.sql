CREATE DATABASE IF NOT EXISTS student;
USE student;
CREATE TABLE academic_calendar
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    calendar_date DATE NOT NULL,
    day_type VARCHAR(30) NOT NULL,
    description VARCHAR(150),

    FOREIGN KEY (student_id) REFERENCES student_data(id)
);