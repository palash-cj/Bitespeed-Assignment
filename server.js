const express=require("express");
const app=express();
const mysql=require('mysql');

const userRoute=require('./routes/userRoute');

app.use('/user',userRoute);

var connection = mysql.createConnection({
    'host': 'sql12.freemysqlhosting.net',
    'user': 'sql12625300',
    'password': 'NLc2ArjhNR',
    'database': 'sql12625300',
    'port': '3306'
})

connection.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("Connected to the database!");
    }
})

app.listen(8000,()=>{
    console.log(`Listening to the port 8000`);
})