const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: 'First name is required',
        trim: true,
    },
    lname: {
        type: String,
        required: 'Last name is required',
        trim: true,
    },
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss', 'Mast'],
        required: 'Title is required',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }, message: 'Please fill a valid email address', isAsync: false
        }
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required'
    }
}, { timestamps: true })

module.exports = mongoose.model('Author', authorSchema, 'authors')