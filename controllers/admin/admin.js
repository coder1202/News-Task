const userModel = require('../../models/user');
const newsModel = require('../../models/news');

const index = (req, res) => {
    res.render('admin/index', { title: 'Express' });
};

const login = (req, res) => {
    res.render('admin/login', { title: 'Express' });
};

const bcrypt = require('bcrypt');
var salt =10

const loginAdmin = async (req, res, next) => {
   
    try {
        console.log("call admin",req.body);
        let email = req.body.email;
        let password = req.body.password;
        
        const userData = await userModel.findOne({email:email,user_type:'admin'});
        if(userData)
        {
            var session;
            bcrypt.compare(password, userData.password, function (err, result) {
            if (result == true) {

                session=req.session;
                console.log("session : ");
                console.log(session);
                session.adminEmail=email;
                session.adminId=userData._id;
                console.log(req.session)
                res.status(200).send({message : 'User login successfully','status' : 'success'});

            } else {
                res.status(200).send({message : 'Invalid password','status' : 'error'});
            }
            })
            
        }
        else{
            res.status(200).send({message : 'User not found','status' : 'error'});
        }  

    } catch (err) {
        console.log("call 4");
        console.log(err);
        res.status(500).json({message : 'Something went wrong','status' : 'error'});
    }

};

const logout = async (req, res, next) => {
    console.log("destroy : ");
    console.log(req.session);
    console.log(req.session.adminEmail);
    delete req.session.adminId;
    delete req.session.adminEmail;
    console.log("after destroy : ");
    console.log(req.session);
    res.redirect('/admin/login');
}


module.exports = {
    index,
    login,
    loginAdmin,
    logout,
}