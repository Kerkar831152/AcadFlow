const express = require("express");

const router = express.Router();

const {
    registerAssessment,
    getAssessmentsDetails,
    updateAssessment,
    deleteAssessment,
    getUpcomingAssessments,
    filterassessments,
    getassessmentsbydaterange,
    getcalculaterequiredwork
} = require("../controllers/assessmentscontroller");
router.post("/register_assessment", registerAssessment);
router.post("/details_assessment", getAssessmentsDetails);
router.patch("/update_assessment", updateAssessment);
router.delete("/delete_assessment", deleteAssessment);
router.post("/upcoming_assessments", getUpcomingAssessments);
router.post("/filter_assessments", filterassessments);
router.post("/get_assessments_by_date_range", getassessmentsbydaterange);
router.post("/calculate_required_work", getcalculaterequiredwork);
module.exports = router;

