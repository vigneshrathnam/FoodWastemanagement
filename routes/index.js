const express=require("express");
const router=express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const db=require("../config/db");
const bcrypt=require("bcryptjs");


router.get("/",forwardAuthenticated,(req,res)=>{
	res.locals.title="Welcome to Node.js";
        res.render("index");
                                                  });


router.get("/dashboard",ensureAuthenticated,(req,res)=>{
	const { user } = req;
	res.locals.title="Welcome "+user.name;
	const { edit }=req.query;
        res.render("dashboard",{ user,edit});
                                                  });                      


router.post("/dashboard",ensureAuthenticated,(req,res)=>{         var {name , password, password2}=req.body;
   
  var errors=[]; 
  const { user } = req;
  const { edit }=req.query;
  res.locals.title="Welcome "+user.name;

  if(!name||!password ||!password2 ){                                               
	  errors.push({msg: "All fields are Required"});
  }
  if(name.length<4 ||  name.length>24){             errors.push({msg: "Name must be atleast 4 characters and atmost 24"});
  }
  if(password.length<=7 || password2.length<=7 ){
        errors.push({msg: "Password must be atleast 8 characters"});
  }
  if(password!==password2 ){
        errors.push({msg: "The password you entered dont match each other"});
  }	
  if(errors.length>0){                         res.render("dashboard",{ user, errors, name, password, password2, edit}); 
}
else{ 
  const newData={ 
  name,
  email: user.email,
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


module.exports=router;