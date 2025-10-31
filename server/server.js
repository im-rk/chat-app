import express from "express"
import "dotenv/config"
import cors from "cors"
import http, { createServer } from "http"
import { create } from "domain"
import { connectDB } from "./lib/db"

//create express app and HTTP server
const app=express()
const server=http.createServer(app)

//MIDDLE WARE SETUP
app.use(express.json({limit:"4mb"}))
app.use(cors())
app.use("/api/status",(req,res)=>{
    res.send("server is live")
});

await connectDB();

const PORT=process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log("Server is running on PORT:"+PORT)
})