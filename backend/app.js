const express = require("express");
const studentRoutes = require("./routes/studentroutes");

const app = express();

app.use(express.json());

app.use("/api", studentRoutes);

app.get("/", (req, res) => {
    res.send("Acadflow backend is running");
});

module.exports = app;