const express=require("express");

const router=express.Router();

const {
    registerAvailability,
    getAvailability,
    updateAvailability,
    deleteAvailability
}=require("../controllers/availabilitycontroller");

const authMiddleware=require("../middleware/authMiddleware");

router.post("/register_availability",authMiddleware,registerAvailability);
router.post("/get_availability",authMiddleware,getAvailability);
router.patch("/update_availability",authMiddleware,updateAvailability);
router.delete("/delete_availability",authMiddleware,deleteAvailability);

module.exports=router;