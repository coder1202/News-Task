const userModel = require('../../models/user');
const newsModel = require('../../models/news');
const { ObjectId } = require('mongodb');
const mv = require('mv');


const myNews = async(req, res) => {

    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const currentDate = new Date();
    console.log("currentDate : ", currentDate);


    // const results = await newsModel.find()
    //     .sort({ _id: -1 })
    //     .skip(startIndex)
    //     .limit(limit)
    //     .exec();


    const results = await newsModel.
    aggregate([{
            $match: {
                userId: ObjectId(req.session.userId),
                // startDate: { $lte: currentDate }, // event start date is less than or equal to current date
                // endDate: { $gte: currentDate }
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

    console.log("my id : ", req.session.userId);
    console.log("my results : : ", results);

    const count = await newsModel.countDocuments({
        userId: ObjectId(req.session.userId),
        startDate: { $lte: currentDate }, // event start date is less than or equal to current date
        endDate: { $gte: currentDate }
    }).exec();

    console.log("my count : ", count);
    console.log("my limit : ", limit);

    res.render('web/my-news', {
        newsData: results,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        baseUrl: 'my-news/',
        limit: 10,
        sessionemail: req.session.userEmail,
        sessionuserType: req.session.userType,
    });

};

const addNews = (req, res) => {
    res.render('web/add-news', { title: 'Express', sessionemail: req.session.userEmail, sessionuserType: req.session.userType, });
};

const editNews = async(req, res) => {

    let getNews = await newsModel.findOne({ _id: ObjectId(req.params.newsId) }).lean();

    console.log("news data : ", getNews);

    const startDate = new Date(getNews.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
    const startDay = String(startDate.getDate()).padStart(2, "0"); // Pad with a leading zero if necessary
    const startDateFinal = `${startYear}-${startMonth}-${startDay}`;


    const endDate = new Date(getNews.endDate);
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
    const endDay = String(endDate.getDate()).padStart(2, "0"); // Pad with a leading zero if necessary
    const endDateFinal = `${endYear}-${endMonth}-${endDay}`;

    getNews.startDate = startDateFinal;
    getNews.endDate = endDateFinal;

    console.log("news data new : ", getNews);


    res.render('web/edit-news', { title: 'Express', sessionemail: req.session.userEmail, sessionuserType: req.session.userType, getNews: getNews });
};



const viewNews = async(req, res) => {

    let getNews = await newsModel.findOne({ _id: ObjectId(req.params.newsId) }).lean();

    let updateData = { $addToSet: { viewerIds: { $each: [req.session.userId] } } };

    await newsModel.updateOne({ _id: ObjectId(req.params.newsId) }, updateData);

    console.log("news data : ", getNews);

    const startDate = new Date(getNews.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
    const startDay = String(startDate.getDate()).padStart(2, "0"); // Pad with a leading zero if necessary
    const startDateFinal = `${startYear}-${startMonth}-${startDay}`;


    const endDate = new Date(getNews.endDate);
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
    const endDay = String(endDate.getDate()).padStart(2, "0"); // Pad with a leading zero if necessary
    const endDateFinal = `${endYear}-${endMonth}-${endDay}`;

    getNews.startDate = startDateFinal;
    getNews.endDate = endDateFinal;

    console.log("news data new : ", getNews);


    res.render('web/view-news', { title: 'Express', sessionemail: req.session.userEmail, sessionuserType: req.session.userType, getNews: getNews });
};

const addNewsPost = async(req, res, next) => {

    try {

        console.log("all data", req.body)


        // var array = req.body.images;
        // for (let index = 0; index < array.length; index++) {
        //     const images = array[index];

        //     console.log("images", images);
        //     var tempNum = 123;
        //     var datetime = new Date()+'yyyymmddHHMMss';
        //     var imageName = '/images/' + datetime + tempNum + ".jpg";
        //     await images.mv('public/' + imageName);

        // }



        // const { username } = req.body;

        // Get the file paths of the uploaded images
        console.log("all images data", req.files);
        const images = req.files.map(file => file.filename);

        // Create a new user object
        // const user = new User({ username, images });

        const data = {
            'title': req.body.title,
            'userId': req.session.userId,
            'description': req.body.description,
            'image': images,
            'startDate': req.body.startDate,
            'endDate': req.body.endDate,
        }

        if (req.body.id) {
            console.log("update news")
            await newsModel.updateOne({ _id: req.body.id }, data, { upsert: true });
            req.flash('success', 'News update successfully');
        } else {
            console.log("add news")
            await newsModel.create(data);
            req.flash('success', 'News create successfully');
        }

        // res.status(200).send({message : 'News create successfully','status' : 'success'});

        return res.redirect('/my-news');


    } catch (err) {
        console.log(err);
        // res.status(500).json({message : err,'status' : 'error'});
        req.flash('error', 'News create failed');
    }

};

module.exports = {
    myNews,
    addNews,
    addNewsPost,
    editNews,
    viewNews
}