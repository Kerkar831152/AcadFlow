const db=require('../db');
const registercalendar=(req,res)=>{
    const {student_id,calendar_date,day_type,description}=req.body;
    const sql=`INSERT INTO academic_calendar (student_id,calendar_date,day_type,description) VALUES (?,?,?,?)`;
    db.query(sql,[student_id,calendar_date,day_type,description],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while registering calender'});
        }
        res.status(201).json({message: 'Calender registered successfully'});
    });
};
const getcalendar=(req,res)=>{
    const {student_id}=req.body;
    const sql=`SELECT * FROM academic_calendar WHERE student_id=?`; 
    db.query(sql,[student_id],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while fetching calender'});
        }
        res.status(200).json({
            data: result
        });
    });
};
const updatecalendar=(req,res)=>{
    const {student_id,calendar_date,day_type,description,old_calender_date}=req.body;
    const sql=`UPDATE academic_calendar SET calendar_date=?,day_type=?,description=? WHERE student_id=? AND calendar_date=?`;
    db.query(sql,[calendar_date,day_type,description,student_id,old_calender_date],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while updating calender'});
        }
        res.status(200).json({message: 'Calender updated successfully'});
    });
};
const deletecalendar=(req,res)=>{
    const {student_id,calendar_date}=req.body;
    const sql=`DELETE FROM academic_calendar WHERE student_id=? AND calendar_date=?`;
    db.query(sql,[student_id,calendar_date],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error occurred while deleting calender'});
        }
        res.status(200).json({message: 'Calender deleted successfully'});
    });
};
module.exports={
    registercalendar
    ,getcalendar
    ,updatecalendar
    ,deletecalendar
};