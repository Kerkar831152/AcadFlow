const express = require("express");
const router = express.Router();
const {
    registerSubject,
    getSubjectsDetails,
    updateSubject,
    deleteSubject
}=require("../controllers/subjectscontroller");
router.post("/register_subject", registerSubject);
router.post("/details_subject", getSubjectsDetails);
router.patch("/update_subject", updateSubject);
router.delete("/delete_subject", deleteSubject);
module.exports = router;