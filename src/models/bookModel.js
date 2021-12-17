const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required',
        unique: true,
        trim: true
    },
    excerpt: {     //small summary or tag line
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    ISBN: {
        type: String,
        required: 'ISBN is required',
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: 'category is required',
        trim: true
    },
    subcategory: {
        type: String,
        required: 'subcategory is required',
        trim: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: 'releasedAt is required'
    }
}, { timestamps: true })
module.exports = mongoose.model('Book', bookSchema)