const { ObjectId } = require('mongodb');
const newsModel = require('../../models/news');

const addNews = (req, res) => {
    res.render('admin/add_news', { title: 'Express' });
};

const editNews = async (req, res) => {
    console.log("get id",req.params.id);

    let getNews = await newsModel.findOne({_id : ObjectId(req.params.newsId)}).lean();

    console.log("news data : ",getNews);

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

    console.log("news data new : ",getNews);


    res.render('admin/edit_news', { title: 'Express', sessionemail: req.session.userEmail, sessionuserType: req.session.userType, getNews: getNews });
};


const viewNews = async (req, res) => {

    let getNews = await newsModel.findOne({_id : ObjectId(req.params.newsId)}).lean();

    console.log("news data : ",getNews);

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

    console.log("news data new : ",getNews);


    res.render('admin/view-news', { title: 'Express', sessionemail: req.session.userEmail, sessionuserType: req.session.userType, getNews: getNews });
};

const getNews = async (req, res, next) => {
    try {
        
        console.log("calling news List");
        let start = parseInt(req.query.start);
        let length = parseInt(req.query.length);
        let search = req.query.search.value;
       
        let queryList = {}

        if (search) {
            queryList ={ 'title': { '$regex': search, $options: 'i' } }
        }
       
        let  allNewsCount= await newsModel.countDocuments(queryList);


        let allNews = await newsModel.
            aggregate([
                {
                '$match': queryList
                }, {
                '$lookup': {
                    'from': 'users', 
                    'localField': '_id', 
                    'foreignField': 'user_id', 
                    'as': 'userData'
                }
                },
                { $sort : { _id : -1 } },
                { $skip : start },
                { $limit : length},
                {
                '$project': {
                    '_id': 1, 
                    'title': 1, 
                    'description': 1, 
                    'startDate': 1, 
                    'endDate': 1, 
                    'createdAt': 1
                }
                }
            ]);
            
        console.log("allNews",allNews);
        var obj = {
            'draw': req.query.draw,
            'recordsTotal': allNewsCount,
            'recordsFiltered': allNewsCount,
            'data': allNews
        };

        return res.send(obj)
      
    } catch (error) {
        console.log('Error in NewsList : ' + error);
        // return new Error('Error in NewsList');
    }
}


const addNewsPost = async (req, res, next) => {
   
    try {

      
        console.log("all images data",req.files);
        const images = req.files.map(file => file.filename);

        const data = {
            'title' : req.body.title,
            'userId' : req.session.adminId,
            'image' : images,
            'description' : req.body.description,
            'startDate' : req.body.startDate,
            'endDate' : req.body.endDate,
        };

       if(req.body.id){
            console.log("update news")
            await newsModel.updateOne({_id : req.body.id},data,{upsert:true});
            req.flash('success', 'News update successfully');
        }
        else
        {
            console.log("add news")
            await newsModel.create(data);
            req.flash('success', 'News create successfully');
        }

        return res.redirect('/admin');

    } catch (err) {
        console.log(err);
        res.status(500).json({message : err,'status' : 'error'});
        return res.redirect('/admin');
    }

};

const newsDelete = async (req, res, next) => {
   
    try {
        await newsModel.deleteOne({_id: req.body.id});
        res.status(200).send({message : 'News delete successfully','status' : 'success'});

    } catch (err) {
        console.log(err);
        res.status(500).json({message : err,'status' : 'error'});
    }

};


module.exports = {
    addNews,
    getNews,
    addNewsPost,
    newsDelete,
    editNews,
    viewNews
}