module.exports=(req,res,next)=>{
    if(req.session.admin) return next();
    else res.redirect('/admin?err=1');
}