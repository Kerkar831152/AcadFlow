const db = require('../db');
const registerAssessment = (req, res) => {
    const { subject_id, student_id,title,type,due_date,weight,difficulty,estimated_hours } = req.body;
    const sql = `INSERT INTO assessments  (subject_id, student_id, title, type, due_date, weight, difficulty, estimated_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(
        sql,
        [subject_id, student_id, title, type, due_date, weight, difficulty, estimated_hours],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Assessment Registration Failed"
                });
            }
            res.status(201).json({
                message: "Assessment added successfully"
            });
        }  
    );
};
const getAssessmentsDetails = (req, res) => {
    const { student_id,subject_id } = req.body;
    const sql = `SELECT * FROM assessments WHERE student_id = ? AND subject_id = ?`;
    db.query(sql, [student_id, subject_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching assessment details"
            });
        }
        res.status(200).json({
            assessments: results
        });
    });
};
const updateAssessment = (req, res) => {
    const { student_id,subject_id,old_title,title, type, due_date, weight, difficulty, estimated_hours } = req.body;
    const sql = `UPDATE assessments SET title = ?, type = ?, due_date = ?, weight = ?, difficulty = ?, estimated_hours = ? WHERE student_id = ? AND subject_id = ? AND title = ?`;
    db.query(sql, 
        [title, type, due_date, weight, difficulty, estimated_hours, student_id, subject_id, old_title], 
        (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error updating assessment"
            });
        }
        res.status(200).json({
            message: "Assessment updated successfully"
        });
    });
};
const deleteAssessment = (req, res) => {
    const { student_id, subject_id, title } = req.body;
    const sql = `DELETE FROM assessments WHERE student_id = ? AND subject_id = ? AND title = ?`;
    db.query(sql,
         [student_id, subject_id, title],
          (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message:"Error deleting assesment"
                });
            }
            res.status(200).json({
                message: "Assessment deleted successfully"
            });
        }
    );
};
const getUpcomingAssessments = (req, res) => {
    const { student_id,student_name} = req.body;
    const sql = `SELECT assessments.id,assessments.student_id,assessments.subject_id,assessments.title,assessments.type,assessments.due_date,assessments.weight,assessments.difficulty,assessments.estimated_hours
    FROM assessments
    JOIN student_data
    ON assessments.student_id = student_data.id
    WHERE assessments.student_id = ? AND student_data.name = ? AND assessments.due_date >= CURDATE() ORDER BY assessments.due_date ASC`;
    db.query(sql, [student_id, student_name], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching upcoming assessments"
            });
        }
        res.status(200).json({
            assessments: results
        });
    });
};
const filterassessments = (req, res) => {
    const { student_id,subject_id,filter } = req.body;
    let sql = `SELECT * FROM assessments WHERE student_id = ? AND subject_id = ?`;
     if (filter.includes("upcoming")) {
        sql += ` AND due_date >= CURDATE()`;
    }
    if (filter.includes("past")) {
        sql += ` AND due_date < CURDATE()`;
    }
    let order = "";
    if (filter.includes("title")) {
        order += "title ASC";
    }
    if (filter.includes("weight")) {
        if (order !== "") {
            order += ", ";
        }
        order += "weight DESC";
    }
    if (filter.includes("difficulty")) {
        if (order !== "") {
            order += ", ";
        }
        order += "difficulty DESC";
    }
    if (filter.includes("estimated_hours")) {
        if (order !== "") {
            order += ", ";
        }
        order += "estimated_hours DESC";
    }
    if (order !== "") {
        sql += ` ORDER BY ${order}`;
    }
    db.query(sql, [student_id, subject_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error filtering assessments"
            });
        }
        res.status(200).json({
            assessments: results
        });
    });
};
const getassessmentsbydaterange = (req, res) => {
    const{student_id,start_date,end_date}=req.body;
    const sql=`SELECT * FROM assessments WHERE student_id=? AND due_date BETWEEN ? AND ? ORDER BY due_date ASC`;
    db.query(sql,[student_id,start_date,end_date],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while fetching assessments by date range'});
        }
        res.status(200).json({data: result});
    }
    );
};
const getcalculaterequiredwork = (req, res) => {
    const { student_id, start_date, end_date } = req.body;

    const sql = `
        SELECT
            (
                SELECT COALESCE(SUM(estimated_hours), 0)
                FROM assessments
                WHERE student_id = ?
                AND due_date BETWEEN ? AND ?
            ) AS total_estimated_hours,

            (
                SELECT study_hours_per_week
                FROM student_availability
                WHERE student_id = ?
            ) AS study_hours_per_week,

            (
                SELECT COUNT(*)
                FROM academic_calendar
                WHERE student_id = ?
                AND calendar_date BETWEEN ? AND ?
                AND day_type IN ('holiday', 'leave')
            ) AS extra_days
    `;

    db.query(
        sql,
        [
            student_id,
            start_date,
            end_date,
            student_id,
            student_id,
            start_date,
            end_date
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error calculating calendar adjusted workload"
                });
            }

            const required_work = Number(result[0].total_estimated_hours) || 0;
            const weekly_capacity = Number(result[0].study_hours_per_week) || 0;
            const extra_days = Number(result[0].extra_days) || 0;

            const extra_hours = extra_days * 2;
            const adjusted_capacity = weekly_capacity + extra_hours;

            let workload_pressure = 0;

            if (adjusted_capacity > 0) {
                workload_pressure = required_work / adjusted_capacity;
            }
            let workload_status = "Normal";
            if (workload_pressure >= 1) 
            {
                workload_status = "Overload";
            }
            else if (workload_pressure >= 0.7) 
            {
                workload_status = "High";
            }
            let recommendation = "";
            if (workload_status === "Overload") {
                recommendation = "High workload detected. Prioritize the nearest deadlines.";
            }
            else if (workload_status === "High") {
                recommendation = "Consider starting the upcoming assessments early.";
            }
            else {
                recommendation = "Workload is manageable.";
            }
            res.status(200).json({
                total_estimated_hours: required_work,
                normal_study_hours: weekly_capacity,
                extra_days: extra_days,
                adjusted_study_hours: adjusted_capacity,
                workload_pressure: workload_pressure,
                workload_status:workload_status,
                recommendation:recommendation
            });
        }
    );
};
module.exports = {
    registerAssessment,
    getAssessmentsDetails,
    updateAssessment,
    deleteAssessment,
    getUpcomingAssessments,
    filterassessments,
    getassessmentsbydaterange,
    getcalculaterequiredwork
};