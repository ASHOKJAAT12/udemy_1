import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser());
app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))
app.use(express.static("public"))




import userRouter from './routers/user.route.js';

app.use("/api/v1/users", userRouter);
export {app}