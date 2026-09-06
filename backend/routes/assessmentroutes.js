const express = require("express");

const router = express.Router();

const {
    registerAssessment,
    getAssessmentsDetails,
    updateAssessment,
    deleteAssessment,
    getUpcomingAssessments,
    filterassessments
} = require("../controllers/assessmentscontroller");
router.post("/register_assessment", registerAssessment);
router.get("/details_assessment", getAssessmentsDetails);
router.patch("/update_assessment", updateAssessment);
router.delete("/delete_assessment", deleteAssessment);
router.get("/upcoming_assessments", getUpcomingAssessments);
router.get("/filter_assessments", filterassessments);
module.exports = router;