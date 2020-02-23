//Initializing and Declaring dependancies
const express=require("express");
const ejs=require("ejs");
const ejsLayouts=require("express-ejs-layouts");
const MongoClient=require("mongodb").MongoClient;
const uri=require("./config/db");
const client=new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });  

//Connecting to Database
client.connect(err=>{
    if(err) throw err;
    console.log("MongoDB connected");
})

//Express Application
const app=express();

//Public files and folders
app.use(express.static("./public"))

//View engine
app.set("view engine","ejs");

//Ejs layout setup
app.use(ejsLayouts);

//Routes
app.get("*",(req,res)=>{
    res.locals.index=req.url;
    res.render("index");
});

//Accesing on port 3000
app.listen(3000,()=>{
    console.log("Server started at port 3000");
});