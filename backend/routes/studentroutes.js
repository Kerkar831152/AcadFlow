const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    registerStudent,
    getStudentDetails,
    updateStudent,
    deleteStudent,
    loginUser
} = require("../controllers/studentcontroller");

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.post("/details", authMiddleware, getStudentDetails);
router.patch("/update", authMiddleware, updateStudent);
router.delete("/delete", authMiddleware, deleteStudent);

module.exports = router;