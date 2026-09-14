const db=require('../db');

const registerAvailability=(req,res)=>{
    const {working_days,college_hours_per_day,study_hours_per_week}=req.body;
    const student_id=req.student_id;

    const sql=`INSERT INTO student_availability (student_id,working_days,college_hours_per_day,study_hours_per_week) VALUES (?,?,?,?)`;

    db.query(sql,[student_id,working_days,college_hours_per_day,study_hours_per_week],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while registering availability'
            });
        }

        res.status(201).json({
            message: 'Availability registered successfully'
        });
    });
};

const getAvailability=(req,res)=>{
    const student_id=req.student_id;

    const sql=`SELECT * FROM student_availability WHERE student_id=?`;

    db.query(sql,[student_id],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while fetching availability'
            });
        }

        res.status(200).json({
            data: result
        });
    });
};

const updateAvailability=(req,res)=>{
    const {working_days,college_hours_per_day,study_hours_per_week}=req.body;
    const student_id=req.student_id;

    const sql=`UPDATE student_availability SET working_days=?,college_hours_per_day=?,study_hours_per_week=? WHERE student_id=?`;

    db.query(sql,[working_days,college_hours_per_day,study_hours_per_week,student_id],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while updating availability'
            });
        }

        res.status(200).json({
            message: 'Availability updated successfully'
        });
    });
};

const deleteAvailability=(req,res)=>{
    const student_id=req.student_id;

    const sql=`DELETE FROM student_availability WHERE student_id=?`;

    db.query(sql,[student_id],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while deleting availability'
            });
        }

        res.status(200).json({
            message: 'Availability deleted successfully'
        });
    });
};

module.exports={
    registerAvailability,
    getAvailability,
    updateAvailability,
    deleteAvailability
};