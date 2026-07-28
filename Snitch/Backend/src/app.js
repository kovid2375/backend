import express from "express";
import { config } from "dotenv";
import cors from "cors"
import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js"

config();
const app=express()
app.use(passport.initialize())

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback",
    
},(accessToken, refreshToken, profile,done)=>{
    return done(null,profile)
}))
app.use("/api/auth",authRouter)
export default app