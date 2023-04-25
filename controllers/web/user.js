const userModel = require('../../models/user');
const newsModel = require('../../models/news');

const bcrypt = require('bcrypt');
var salt = 10

const index = async(req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const currentDate = new Date();

    console.log("startIndex", startIndex);
    console.log("session id", req.session.userId);
    console.log("currentDate", currentDate);
    const results = await newsModel.
    aggregate([{
            $match: {
                startDate: { $lte: currentDate }, // event start date is less than or equal to current date
                endDate: { $gte: currentDate },
                viewerIds: { $nin: [req.session.userId] },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        { $skip: startIndex },
        { $limit: limit },
        { $sort: { _id: -1 } },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                image: 1,
                startDate: 1,
                endDate: 1,
                createdAt: 1,
                username: '$userData.username',
            }
        }
    ]);

    console.log("results : : ", results);
    console.log("currentDate", currentDate);

    // const countDocument = await newsModel.countDocuments(
    // {
    //     startDate: { $lte: currentDate },
    //     endDate: { $gte: currentDate },
    //     viewerIds: {$nin: [req.session.userId]},
    // }
    // );

    const countDocument = await newsModel.
    aggregate([{
            $match: {
                startDate: { $lte: currentDate }, // event start date is less than or equal to current date
                endDate: { $gte: currentDate },
                viewerIds: { $nin: [req.session.userId] },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        {
            $project: {
                _id: 1,
            }
        }
    ]);

    console.log("countDocument : ", countDocument.length);
    console.log("limit : ", limit);

    res.render('web/index', {
        newsData: results,
        currentPage: page,
        totalPages: Math.ceil(countDocument.length / limit),
        baseUrl: '/',
        limit: 10,
        sessionemail: req.session.userEmail,
        sessionuserType: req.session.userType,
    });

};

const login = (req, res) => {
    res.render('web/login', { sessionemail: req.session.userEmail, sessionuserType: req.session.userType, });
};

const signup = (req, res) => {
    res.render('web/signup', { sessionemail: req.session.userEmail, sessionuserType: req.session.userType, });
};

const addUser = async(req, res, next) => {

    try {

        console.log("all data", req.body)

        let password = req.body.password;

        let myPromise = new Promise(function(resolve, reject) {

            bcrypt.hash(password, salt, (err, encrypted) => {
                password = encrypted
                resolve(password);
            })

        });

        password = await myPromise;


        const data = await new userModel({
            'username': req.body.username,
            'email': req.body.email,
            'mobile_no': req.body.mobile_no,
            'password': password,
            'user_type': req.body.user_type,
        });

        data.save().then(item => {
                res.status(200).send({ message: 'User register successfully', 'status': 'success' });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: 'Something went wrong', 'status': 'error' });
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err, 'status': 'error' });
    }

};


const loginUser = async(req, res, next) => {

    try {
        let email = req.body.email;
        let password = req.body.password;
        let user_type = req.body.user_type;

        await userModel.findOne({ email: email }).then(userData => {
                if (userData) {
                    var session;
                    bcrypt.compare(password, userData.password, function(err, result) {
                        if (result == true) {

                            session = req.session;
                            console.log("session : ");
                            console.log(session);
                            session.userEmail = email;
                            session.userId = userData._id;
                            session.userType = userData.user_type;
                            console.log(req.session)
                            res.status(200).send({ message: 'User login successfully', 'status': 'success' });

                        } else {
                            res.status(200).send({ message: 'Invalid password', 'status': 'error' });
                        }
                    })

                } else {
                    res.status(200).send({ message: 'User not found', 'status': 'error' });
                }
            })
            .catch(err => {
                console.log("call 3");
                res.status(500).send({ message: 'Something went wrong', 'status': 'error' });
            });


    } catch (err) {
        console.log("call 4");
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', 'status': 'error' });
    }

};

const logout = async(req, res, next) => {
    console.log("destroy : ");
    console.log(req.session);
    console.log(req.session.userEmail);
    // req.session.destroy();
    delete req.session.userId;
    delete req.session.userEmail;
    delete req.session.sessionuserType;


    console.log("after destroy : ");
    console.log(req.session);
    res.redirect('/login');
}

module.exports = {
    index,
    login,
    signup,
    addUser,
    loginUser,
    logout
}