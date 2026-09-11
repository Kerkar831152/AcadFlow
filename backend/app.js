const express = require("express");
const studentRoutes = require("./routes/studentroutes");
const subjectRoutes = require("./routes/subjectsroutes");
const assessRoutes = require("./routes/assessmentroutes");
const availabilityroutes=require("./routes/availabilityroutes");
const calendarroutes=require("./routes/calendarroutes");    
const app = express();
const cors = require("cors");
app.use(cors()); 
app.use(express.json());
app.use("/api", subjectRoutes);
app.use("/api", studentRoutes);
app.use("/api", calendarroutes);
app.use("/api", assessRoutes);
app.use("/api",availabilityroutes);
app.get("/", (req, res) => {
    res.send("Acadflow backend is running");
}); 

module.exports = app;