require('dotenv').config();

const PORT=process.env.host || 8001;

const express=require("express");
const app=express();
const mysql=require('mysql2');

const userRoute=require('./routes/userRoute');

const bodyParser=require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/user',userRoute);


app.listen(PORT,()=>{
    console.log(`Listening to the port ${PORT}`);
})