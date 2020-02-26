const express=require("express");
const router=express.Router();

router.get("/",(_req,res)=>{
    res.render("index");
});

router.get("/signup",(_req,res)=>{
    res.render("signup");
});

router.get("/login",(_req,res)=>{
    res.render("login");
});

module.exports=router;