import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./utils/connectDB.js"
import userRoutes from "./routes/user.route.js"
import { server, app } from "./socket/index.js"
import path from "path"

dotenv.config()
app.use(cors({
    origin: "http://localhost:5173",
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", userRoutes)
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html")) 
})

server.listen(process.env.PORT, ()=>{
    console.log("Server is running on Port", process.env.PORT)
    connectDB()
})
