import dotenv from 'dotenv';
import express from 'express';
dotenv.config({
    path: "./.env"
})
const app = express();
const PORT = process.env.PORT;
app.get('/', (req, res) => {
    app.send("Hello.");
})

app.listen(PORT, (req, res) => {
    console.log(`server is live on port ${PORT}`)
})