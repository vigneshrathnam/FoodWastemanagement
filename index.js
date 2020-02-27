//Initializing and Declaring dependancies
const express=require("express");
const ejs=require("ejs");
const ejsLayouts=require("express-ejs-layouts");
const port=process.env.port || 3000;
const layout=require("express-ejs-layouts");
const flash=require("connect-flash");
const session=require("express-session");
const passport=require("passport");

//Passport initialization
require('./config/passport')(passport);

//To use post request
app.use(express.urlencoded({extended: true}));

//Session
app.use(session({  secret:"$ecret0101", resave: true, saveUninitialized: true}));

//Express Application
const app=express();


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{                          
     res.locals.success_msg=req.flash("success_msg");
     res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    next();                                   
      });


//Public files and folders
app.use(express.static("./public"))

//View engine
app.set("view engine","ejs");
app.use(ejsLayouts);

//Routes
app.use("/",require("./routes/index.js"));

//Accesing server on port 3000

//Port Addressing
app.listen(port,()=>console.log(`Listening at http://localhost:${port}`));