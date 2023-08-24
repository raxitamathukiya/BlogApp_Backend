const express=require('express')
const app=express()
const {userroute}=require('./router/user.route')
const {connection}=require("./db")
require('dotenv').config()
const cors=require('cors')
app.use(cors())
app.use(express.json())


    app.get('/',async(req,res)=>{
    try {
        res.status(200).send("welcome to Blog Application ")
    } catch (error) {
        console.log(error)
    }
})


app.use("/api",userroute)
app.listen(8080,()=>{
    console.log("server is running .....")
})