const db = require('../config/db');
const registerSubject = (req, res) => {
    const { student_id,subject_name,subject_code} = req.body;
    const sql = `INSERT INTO subjects 
    (student_id, subject_name, subject_code) 
    VALUES (?, ?, ?)`;
    db.query(
        sql,
        [student_id, subject_name, subject_code],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Subject Registration Failed"
                });
            }
            res.status(201).json({
                message: "Subject added successfully"
            });
        }
    );
};
const getSubjectsDetails= (req, res) => {
    const { student_id} = req.body;
    const sql = `SELECT * FROM subjects WHERE student_id = ?`;
    db.query(
        sql,
        [student_id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Subject Retrieval Failed"
                });
            }
            res.status(200).json({
                message: "Subject details retrieved successfully",
                data: result
            });
        }
    );
};
const updateSubject= (req, res) => {
    const {id, subject_name, subject_code} = req.body;
    const sql = `UPDATE subjects
    SET subject_name = ?, subject_code = ? WHERE id = ?`;
    db.query(
        sql, 
        [subject_name, subject_code,id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Subject Update Failed"
                });
            }
            res.status(200).json({
                message: "Subject details updated successfully"
            });
        }
    );
};
const deleteSubject = (req, res) => {
    const { student_id,subject_name} = req.body;
    const sql = `DELETE FROM subjects WHERE student_id=? AND subject_name=?`;
    db.query(
        sql,
        [student_id, subject_name],
        (err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "Subject Deletion Failed"  
                })
            }
            res.status(200).json({
                message: "Subject deleted successfully"
            })
        }
    );
};
module.exports = {
    registerSubject,
    getSubjectsDetails,
    updateSubject,
    deleteSubject
};