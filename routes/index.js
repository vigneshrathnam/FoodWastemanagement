//Init Dependencies
const express=require("express");
const router=express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const db=require("../config/db");
const bcrypt=require("bcryptjs");
const path=require("path");
const submitdb=require("../config/FoodData");
const upload=require("./upload.js");

//Routers
router.get("/support",(req,res)=> {
  res.send("Support page");
});

router.get("/about",(req,res)=> {
  res.send("Support page");
});

router.get("/",(req,res)=>{
	res.locals.title="Food waste management";
        res.render("index");
       });


router.get("/dashboard",ensureAuthenticated,(req,res)=>{
  const { user } = req;
	res.locals.title="Welcome "+user.name;
	const { edit }=req.query;
        res.render("dashboard",{ user,edit});
      });                      


router.post("/dashboard",ensureAuthenticated,(req,res)=>{      
  var {name , password, password2}=req.body;
  var errors=[];
  const { user } = req;
  const { edit }=req.query;
  res.locals.title="Welcome "+user.name;

  if(!name||!password ||!password2 ){                                               
	  errors.push({msg: "All fields are Required"});
  }
  if(name.length<4 ||  name.length>24){        
     errors.push({msg: "Name must be atleast 4 characters and atmost 24"});
  }
  if(password.length<=7 || password2.length<=7 ){
    errors.push({msg: "Password must be atleast 8 characters"});
  }
  if(password!==password2 ){
    errors.push({msg: "The password you entered dont match each other"});
  }	
  if(errors.length>0){         
    res.render("dashboard",{ user, errors, name, password, password2, edit}); 
}
else{ 
  const newData={ 
  name,
  phno: user.phhno,
  password,
  timeStamp: user.timeStamp
}
bcrypt.genSalt(10, function(err, salt) {        
	bcrypt.hash(newData.password, salt, function(err, hash) {            
		if(err) throw err;
         	 else{         
         	   newData.password=hash;         
		    db.update({ _id: user._id },newData,{ },(err, num)=> {         	
	      if(err) throw err;
              else{
    		req.flash("success_msg","Your profile updated successfully!");            
		res.redirect("dashboard?edit");       
}


});
}
});                                   

});                     


}
});

router.use((req,res,next)=> {
  res.locals.quantity=req.query.quantity;
  res.locals.location=req.query.location;
})

router.post("/submitFood",ensureAuthenticated,(req,res)=> {
  let errors=[];
  var location,quantity;
  upload(req,res,(err)=> {
    if (err) {
      errors.push({ message : err.message });
      req.flash("fileErr_msg",errors);
      return res.redirect(`/dashboard?location=${req.body.location}&quantity=${req.body.quantity}`);
    }
    else {
      location=req.body.location || "";
      quantity=req.body.quantity || 0;
      console.log(location,quantity)
      if(req.file == undefined) {
        errors.push({ message : "No file is selected" });
      }
      //
      
if(!quantity || !location) {
  errors.push({  message: "All fields are required" });
 }
 
 if(parseInt(quantity) === NaN) {
  errors.push({  message: "Number is required for quantity" });
 }
 
 if(!(quantity>=1 && quantity<1000)){
  errors.push({  message: "quantity must be greater than 1 kg and atmost of 999 kg" });
 }
 
 
 if(typeof location != undefined && location != "" && location != null) {
   if (!(location.length>=3 && location.length<=50))
   errors.push({  message: "location  length must be greater than 2 characters and maximum of 50 characters" });
 }
 
    if(errors.length>0) {
      req.flash("fileErr_msg",errors);
      return res.redirect(`/dashboard?location=${req.body.location}&quantity=${req.body.quantity}`);
    }
 
    else {
      console.log(req.file)
        //Database code goes here
      const doc={
        location,
        quantity,
        imgPath: req.file.filename,
        postedBy: req.user.name,
        timeStamp: Date.now()
      }
 
      submitdb.insert(doc,(err,docs)=> {
        if(err) {
          errors.push({ message : "Some err has been occured" });
          req.flash("fileErr_msg",errors);
          return res.redirect("/dashboard");
        }
        if(docs) {
          req.flash("fileSuccess_msg","Your response have been saved");
          res.redirect("/dashboard");
        }
      });
    } 
    }
  });
  
});

module.exports=router;