CREATE TABLE subjects
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(30),
    FOREIGN KEY (student_id) REFERENCES student_data(id) ON DELETE CASCADE
);