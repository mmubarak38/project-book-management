const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Blog title is required',
        trim: true
    },

    excerpt: {
        type: String,
        required: true
    },

    userId: {
        required: 'Blog user is required',
        type: mongoose.Types.ObjectId, refs: 'User'
    },

    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        trim: true,
        required: 'Blog category is required'
    },
    subcategory: {
        type: String,
        required: true
    },


    reviews: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,
    },

}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema, 'blogs')