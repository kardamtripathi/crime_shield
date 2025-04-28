import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/userRouter.js'
import jobRouter from './routes/jobRouter.js'
import applicationRouter from './routes/applicationRouter.js'
import otherJobsRouter from './routes/crimeNewsRoute.js'
import cyberCrimeRouter from './routes/cyberCrimeRouter.js'
import chatbotRouter from './routes/chatbotRouter.js'
import spamcheckerRouter from './routes/spamcheckerRouter.js'
import { dbConnection } from "./database/dbConnection.js"
import {errorMiddleware} from './middlewares/error.js'
const app = express()
dotenv.config({path: "./config/config.env"});
app.use(cors({
    origin: ["https://job-portal-application-q2es.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    preflightContinue: false,
    credentials: true,
    headers : ["Origin", "Content-Type", "Accept"]
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use("/api/user", userRouter);
app.use("/api/application", applicationRouter);
app.use("/api/job", jobRouter);
app.use("/api/crimeNews", otherJobsRouter);
app.use("/api/cybercrime", cyberCrimeRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/spam-checker", spamcheckerRouter);
dbConnection();
app.use(errorMiddleware)
export default app
