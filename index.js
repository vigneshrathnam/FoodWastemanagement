//Initializing and Declaring dependancies
const express=require("express");
const ejs=require("ejs");
const ejsLayouts=require("express-ejs-layouts");
const port=process.env.port || 80;
const layout=require("express-ejs-layouts");
const flash=require("connect-flash");
const session=require("express-session");
const passport=require("passport");
const cookieParser=require("cookie-parser");
const logger=require("morgan");

//Express Application
const app=express();

//Passport initialization
require('./config/passport')(passport);

//To use post request
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Session
app.use(session({  secret:"$ecret0101", resave: true, saveUninitialized: true}));

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
  res.locals.user=req.user;
  res.locals.fileSuccessMsg=req.flash("fileSuccess_msg");
  res.locals.fileErrorMsg=req.flash("fileErr_msg");
  next();                                   
      });

//Public files and folders
app.use(express.static("./public"))

//View engine
app.set("view engine","ejs");
app.use(ejsLayouts);

//Routes
app.use("/",require("./routes/index"));
app.use("/",require("./routes/users"));
app.use("/",require("./routes/admin"));
app.use("/",require("./routes/contact"));

//Accesing server on port 80
app.listen(port,()=>console.log(`Listening at http://localhost:${port}`));