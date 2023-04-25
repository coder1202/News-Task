const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let news = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        // required: true,
        //we can create validation with specific message in scheema
        required: [true, "name not provided. Cannot create user without name "],
    },
    description: {
        type: String,
        // required: true,
        //we can create validation with specific message in scheema
        required: [true, "name not provided. Cannot create user without name "],
    },
    image: {
        type: Array,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    viewerIds: {
        type: Array,
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const model = mongoose.model("news", news);

module.exports = model;