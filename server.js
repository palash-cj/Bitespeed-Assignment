require('dotenv').config();

const express=require("express");
const app=express();
const mysql=require('mysql');

const userRoute=require('./routes/userRoute');

const bodyParser=require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/user',userRoute);

// var connection = mysql.createConnection({
//     'host': process.env.db_host,
//     'user':process.env.user_name,
//     'password': process.env.password,
//     'database': process.env.db_name,
//     'port': process.env.port
// })

// connection.connect((err)=>{
//     if(err){
//         throw err;
//     }
//     else{
//         console.log("Connected to the database!");
//     }
// })

app.listen(8000,()=>{
    console.log(`Listening to the port 8000`);
})