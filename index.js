const express=require("express");
const mongodb=require("mongodb");
const ejs=require("ejs");

const app=express();

app.get("/",(req,res)=>{
    res.send("Hello world");
});

app.listen(3000,()=>{
    console.log("Server started at port 3000");
})