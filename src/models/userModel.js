const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: 'Title is required',
    },
    name: {
        type: String,
        required: 'First name is required',
        trim: true,
    },
    phone: {
        type: Number,
        trim: true,
        unique: true,
        required: 'Mobile number is required',
        validate: function (phone) {
            return /^\d{10}$/.test(phone)
        }, message: 'Please fill a valid phone number', isAsync: false
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
    },
    address: {
        street: String,
        city: String,
        pincode: String
      },
}, { timestamps: true })
module.exports = mongoose.model('User', userSchema)