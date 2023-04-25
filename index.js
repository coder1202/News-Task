const express = require('express')
var path = require('path');
const app = express()
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const port = 3000
var bodyParser = require('body-parser')
const mongoose = require("mongoose");
const sessions = require('express-session');
const userModel = require('./models/user');
const fs = require('fs');

const flash = require('connect-flash');

const bcrypt = require('bcrypt');
var salt = 10

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept");
    next();
});

// const staticPath = path.join(__dirname, "../public")
// app.use(express.static(staticPath))

const oneDay = 1000000 * 60;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


mongoose.connect("mongodb://localhost:27017/practical1", {
    useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
    insertAdminData();
})
const webRouter = require("./routes/web");
const adminRouter = require("./routes/admin");
const apiRouter = require("./routes/api");

app.use('/', webRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

const insertAdminData = async() => {

    let password = '123456';

    let myPromise = new Promise(async function(resolve, reject) {

        bcrypt.hash(password, salt, (err, encrypted) => {
            password = encrypted
            resolve(password);
        });

    });

    password = await myPromise;

    const adminData = {
        'username': 'admin',
        'email': 'admin@gmail.com',
        'mobile_no': '9987766544',
        'password': password,
        'user_type': 'admin',
    };
    console.log("adminData", adminData);

    const adminDataResponse = await userModel.updateOne({ email: 'admin@gmail.com' }, adminData, { upsert: true });

    console.log("adminDataResponse", adminDataResponse);

}