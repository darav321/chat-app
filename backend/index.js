import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./utils/connectDB.js"
import userRoutes from "./routes/user.route.js"
import { server, app } from "./socket/index.js"

dotenv.config()
app.use(cors({
    origin: "https://chat-more-zwg6-git-main-varad-kales-projects.vercel.app/",
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", userRoutes)

server.listen(process.env.PORT, ()=>{
    console.log("Server is running on Port", process.env.PORT)
    connectDB()
})
