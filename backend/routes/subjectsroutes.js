const express = require("express");
const router = express.Router();
const {
    registerSubject,
    getSubjectsDetails,
    updateSubject,
    deleteSubject
}=require("../controllers/subjectscontroller");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/register_subject",authMiddleware,registerSubject);
router.post("/details_subject",authMiddleware,getSubjectsDetails);
router.patch("/update_subject",authMiddleware,updateSubject);
router.delete("/delete_subject",authMiddleware,deleteSubject);
module.exports = router;