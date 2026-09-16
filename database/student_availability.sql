CREATE TABLE student_availability
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    working_days INT NOT NULL,
    college_hours_per_day DECIMAL(4,2) NOT NULL,
    study_hours_per_week DECIMAL(5,2) NOT NULL,

    FOREIGN KEY (student_id) REFERENCES student_data(id) ON DELETE CASCADE
);