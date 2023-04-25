exports.authMiddleware =  [
    (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    session=req.session;
        if(session.adminEmail){

            next();
        }
        else
        {
            res.redirect('/admin/login');
        }
}];
