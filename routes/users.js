const express=require("express");
const router=express.Router();        
const passport=require("passport");      
var db=require("../config/db.js");
var bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../config/auth');

router.get("/register",forwardAuthenticated,(req,res)=>{
  res.locals.title="Registration Page"; 
  res.render("register");

});

router.get("/login",forwardAuthenticated,(req,res)=>{
  res.locals.title="Login form";
  res.render("login");

});

router.get("/users",(req,res)=>{
		db.find({},(err,docs)=>{
		res.json(docs);
});
});


router.post("/register",(req,res)=>{
  var {name , phno, password, password2}=req.body;
  var errors=[];
  if(!name || !phno||!password ||!password2 ){
	errors.push({msg: "All fields are Required"});
  }
  if(name.length<4 ||  name.length>24){
        errors.push({msg: "Name must be atleast 4 characters and atmost 24"});
  }
  if(password.length<=7 ){
        errors.push({msg: "Password must be atleast 8 characters"});
  }
  if(password!==password2 ){
        errors.push({msg: "The password you entered dont match each other"});
  }
  if( parseInt(phno)=== NaN || phno.toString().length!==10){
	errors.push({msg: "The entered Mobile No. is not valid"});}

  if(errors.length>0){
   return res.render("register",{
  title: "Registration Page",
  errors,
  name,
  phno,
  password,
  password2
});
}
  else{
  db.findOne({phno },(err, doc)=> {
	  if(doc){
   errors.push({msg: "This Mobile No. Already registered"});
	  res.locals.title="Registration Page";
  return res.render("register",{ errors, name, phno, password, password2 });
}
	  else{
	let userData={
	  name,
	  phno,
	  password,
	  timeStamp: Date.now()
	}
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(userData.password, salt, function(err, hash) {
        if(err) throw err;
	else{
	  userData.password=hash;
	  db.insert(userData,(err, newDocs)=> {   
      if(err) throw err;                    
      else console.log("A user registered");

});
  req.flash("success_msg","You're now Registered. Login to continue");                   
           res.redirect("/login");
	}
    });
});

}
});
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});


router.get("/forgotpass",(req,res)=>{
   res.locals.title="Forget Password";	
   res.render("forgot");
});

router.post("/forgotpass",(req,res)=>{
   const { phno }=req.body;
   let errors=[];
   res.locals.title="Forget Password";
   if(!phno){
	errors.push({ msg: "Mobile No. is Required" });
   }
  
   if( parseInt(phno)=== NaN || phno.length!=10){
        errors.push({msg: "The entered Mobile No. is not valid"});
}

   if(errors.length>0){
   res.render("forgot",{ errors, phno  });
   }
   else
   {
	db.findOne({ phno },(err,user)=>{
		if(err) throw err;
		else if(!user){
			req.flash("error_msg","This Mobile No. is Not Registered");
			res.redirect("/forgotpass");
		}
    else{                
      req.flash("success_msg","A confirmation message is sent to your mail");
      res.redirect("/forgotpass");
                }

	});
   }
});


module.exports=router;
