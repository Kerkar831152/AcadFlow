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

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register_assessment", authMiddleware, registerAssessment);
router.post("/details_assessment", authMiddleware, getAssessmentsDetails);
router.patch("/update_assessment", authMiddleware, updateAssessment);
router.delete("/delete_assessment", authMiddleware, deleteAssessment);
router.post("/upcoming_assessments", authMiddleware, getUpcomingAssessments);
router.post("/filter_assessments", authMiddleware, filterassessments);
router.post("/get_assessments_by_date_range", authMiddleware, getassessmentsbydaterange);
router.post("/calculate_required_work", authMiddleware, getcalculaterequiredwork);

module.exports = router;