const express=require("express");
const router=express.Router();  
const {
    registercalendar
    ,getcalendar
    ,updatecalendar
    ,deletecalendar
}=require("../controllers/calendarcontroller");
router.post("/register_calendar",registercalendar);
router.get("/get_calendar",getcalendar);
router.patch("/update_calendar",updatecalendar);
router.delete("/delete_calendar",deletecalendar);
module.exports=router;