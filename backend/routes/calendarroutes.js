const express=require("express");

const router=express.Router();

const {
    registercalendar,
    getcalendar,
    updatecalendar,
    deletecalendar
}=require("../controllers/calendarcontroller");

const authMiddleware=require("../middleware/authMiddleware");

router.post("/register_calendar",authMiddleware,registercalendar);
router.post("/get_calendar",authMiddleware,getcalendar);
router.patch("/update_calendar",authMiddleware,updatecalendar);
router.delete("/delete_calendar",authMiddleware,deletecalendar);

module.exports=router;