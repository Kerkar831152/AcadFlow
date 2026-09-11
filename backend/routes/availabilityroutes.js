const express=require("express");
const router=express.Router();  
const {
    registerAvailability
    ,getAvailability
    ,updateAvailability
    ,deleteAvailability
}=require("../controllers/availabilitycontroller");
router.post("/register_availability",registerAvailability);
router.post("/get_availability",getAvailability);
router.patch("/update_availability",updateAvailability);
router.delete("/delete_availability",deleteAvailability);
module.exports=router;