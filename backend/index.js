const express = require('express')
let dbConnect = require("./dbConnect")
const app = express()
const userRouter = require('./routes/userRoutes')
const assessmentRouter = require('./routes/assessmentRoutes')
const port = process.env.PORT || 3000
app.listen(port,()=> {
    console.log(`Listening at port ${port}`)
})
// Not fully sure I need this app.use function. Depends on CORS stuff.
app.use((req,res,next) => {
    res.set("Access-Control-Allow-Origin","*");
    res.set("Access-Control-Allow-Headers","*");
    res.set("Access-Control-Allow-Methods","*");
    if (res.method == "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
})
app.use(express.json)
app.use(userRouter)