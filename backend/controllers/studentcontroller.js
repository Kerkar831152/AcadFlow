const db = require("../db");
const bcrypt = require("bcrypt");
const registerStudent = async (req, res) => {
    const { name, email, password, college, course, semester } = req.body;

    const sql = `INSERT INTO student_data 
    (name, email, password, college, course, semester) 
    VALUES (?, ?, ?, ?, ?, ?)`;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        sql,
        [name, email, hashedPassword, college, course, semester],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Registration failed"
                });
            }

            res.status(201).json({
                message: "Account created successfully"
            });
        }
    );
};

const getStudentDetails = (req, res) => {
    const { name } = req.body;

    const sql = "SELECT * FROM student_data WHERE name = ?";

    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error retrieving student details"
            });
        }

        res.status(200).json(result);
    });
};

const updateStudent = (req, res) => {
    const { name, college, course, semester } = req.body;

    const sql = `UPDATE student_data 
    SET college = ?, course = ?, semester = ? 
    WHERE name = ?`;

    db.query(
        sql,
        [college, course, semester, name],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error updating student details"
                });
            }

            res.status(200).json({
                message: "Student details updated successfully"
            });
        }
    );
};

const deleteStudent = (req, res) => {
    const { name } = req.body;

    const sql = `DELETE FROM student_data WHERE name = ?`;

    db.query(
        sql,
        [name],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error deleting student details"
                });
            }

            res.status(200).json({
                message: "Student account deleted successfully"
            });
        }
    );
};

module.exports = {
    registerStudent,
    getStudentDetails,
    updateStudent,
    deleteStudent
};