const jwt = require("jsonwebtoken");
const db = require("../db");

const ADMIN_EMAIL = "vvk@gmail.com";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.student_id = decoded.student_id;

        next();
    }
    catch (err) {
        try {
            const decoded = jwt.decode(token);

            if (!decoded || !decoded.student_id) {
                return res.status(401).json({
                    message: "Invalid or expired token"
                });
            }

            const student_id = decoded.student_id;

            const sql = "SELECT email FROM student_data WHERE id = ?";

            db.query(sql, [student_id], (dbErr, result) => {
                if (dbErr) {
                    console.log(dbErr);
                    return res.status(401).json({
                        message: "Invalid or expired token"
                    });
                }

                if (result.length > 0 && result[0].email !== ADMIN_EMAIL) {
                    const deleteSql = "DELETE FROM student_data WHERE id = ?";

                    db.query(deleteSql, [student_id], (deleteErr) => {
                        if (deleteErr) {
                            console.log(deleteErr);
                        }

                        return res.status(401).json({
                            message: "Your session has expired and your account has been deleted"
                        });
                    });
                }
                else {
                    return res.status(401).json({
                        message: "Invalid or expired token"
                    });
                }
            });
        }
        catch (decodeError) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }
    }
};

module.exports = authMiddleware;