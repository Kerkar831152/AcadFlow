const express = require("express");

const router = express.Router();

const {
    registerStudent,
    getStudentDetails,
    updateStudent,
    deleteStudent
} = require("../controllers/studentcontroller");

router.post("/register", registerStudent);
router.get("/details", getStudentDetails);
router.patch("/update", updateStudent);
router.delete("/delete", deleteStudent);

module.exports = router;