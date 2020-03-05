const express=require("express");
const router=express.Router();
const ensureAuthenticated=require("../config/admin");
const db=require("../config/db.js");
const submitDB=require("../config/FoodData");

//this is your default password please change it
const password='12345';
layout= "admin/layout" ;

router.get("/admin/",(req,res)=> {
    var type=req.query.err;
    var { admin } = req.session;
    const { viewType=1 }=req.query;
    if(admin) {
        submitDB.find({},(er,food)=> {
            var foods=food;
            db.find({}, function (err, docs) {
                if(err) throw err;
                console.log(foods);
                res.render("admin/index",{ layout,docs,foods,viewType });
            });
        })
    }
    else
    res.render("admin/login",{ layout: false,password,type });
});

router.post("/admin/",(req,res)=> {
    var { admin } = req.session;
    var type=undefined;
    var pass=req.body.password, err="password is not valid";
    if(admin)
    res.render("admin/index",{ layout });
    else {
        if(pass == password)
        {
            req.session.admin=1;
            res.redirect("/admin");
        }
        else {
            res.redirect("/admin?err=2");
        }
    }
});

router.get("/admin/logout",ensureAuthenticated,(req,res)=> {
    req.session.destroy((err)=> {
        if(err) res.status(500).json(err);
        else res.redirect("/admin?err=3");
    });
})


module.exports=router;