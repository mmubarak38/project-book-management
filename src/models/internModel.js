const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'intern name is mandatory'
    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    mobile: {
        type: String,
        required: 'mobile number is mandatory',
        unique: 'this mobile number is already being used',
        // mobile validaor
    },
    collegeId: {
        type: ObjectId,
        required: 'collegeId is mandatory',
        ref: 'college'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })
module.exports = mongoose.model('intern', internSchema)
