const express=require("express");
const app=express.Router();

const {identifyUser}=require("../controller/userController");

app.post('/identify',identifyUser);

module.exports=app;