import express from "express";
import { config } from "dotenv";


import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js"

config();
const app=express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
export default app