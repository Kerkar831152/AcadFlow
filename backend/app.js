const express = require("express");
const studentRoutes = require("./routes/studentroutes");
const subjectRoutes = require("./routes/subjectsroutes");
const assessRoutes = require("./routes/assessmentroutes");
const app = express();

app.use(express.json());
app.use("/api", subjectRoutes);
app.use("/api", studentRoutes);
app.use("/api", assessRoutes);  
app.get("/", (req, res) => {
    res.send("Acadflow backend is running");
}); 

module.exports = app;