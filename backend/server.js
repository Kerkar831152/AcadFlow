const app = require('./app');
app.get('/',(req,res)=>{
    res.send("Acadflow backend is running");
})
app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000");
})
