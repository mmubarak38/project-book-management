const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Book title is required',
        trim: true ,
        unique:true
    },
    bookCover: {
        type: String,
        required: 'Book cover is required',
        trim: true ,
        unique:true
    },

    excerpt: {
        type: String,
        required: true,
        trim:true
    },

    userId: {
        required: 'Book user is required',
        type: mongoose.Types.ObjectId, 
        refs: 'User'
    },

    ISBN: {
        type: String,
        required: true,
        unique: true ,
        trim:true
    },
    category: {
        type: String,
        trim: true,
        required: 'Book category is required'
    },
    subcategory: {
        type: String,
        required: true,
        trim:true
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
        type:Date,
        required: true,
    },

}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)