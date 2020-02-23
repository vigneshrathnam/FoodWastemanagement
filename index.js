//Initializing and Declaring dependancies
const express=require("express");
const MongoClient=require("mongodb").MongoClient;
const ejs=require("ejs");
const uri=require("./config/db");
const client=new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true })

//Connecting to Database
client.connect(err=>{
    if(err) throw err;
    console.log("MongoDB connected");
})

//Express Application
const app=express();

app.get("/",(req,res)=>{
    res.send("Hello world");
});

app.listen(3000,()=>{
    console.log("Server started at port 3000");
});