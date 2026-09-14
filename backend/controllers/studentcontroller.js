const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM student_data WHERE email=?`;

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Login failed"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                student_id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token: token
        });
    });
};

const getStudentDetails = (req, res) => {
    const student_id = req.student_id;

    const sql = "SELECT * FROM student_data WHERE id = ?";

    db.query(sql, [student_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error retrieving student details"
            });
        }

        res.status(200).json({
            data: result
        });
    });
};

const updateStudent = (req, res) => {
    const { college, course, semester } = req.body;
    const student_id = req.student_id;

    const sql = `UPDATE student_data
    SET college = ?, course = ?, semester = ?
    WHERE id = ?`;

    db.query(
        sql,
        [college, course, semester, student_id],
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
    const student_id = req.student_id;

    const sql = `DELETE FROM student_data WHERE id = ?`;

    db.query(
        sql,
        [student_id],
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
    deleteStudent,
    loginUser
};