import dotenv from 'dotenv';
import { app } from "./app.js";
import connectionDB from './db/index.js';

dotenv.config({
    path: './.env'
})
const PORT = process.env.PORT || 4000;
connectionDB()
.then(()=>{
    app.listen(PORT,(req, res)=>{
        console.log(`server is listen on port ${PORT}`);
    })
})
.catch((error)=>{
    console.log("mongodb connection faild.");
})