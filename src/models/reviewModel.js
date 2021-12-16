const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'Book',
        required: true
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim: true
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model('Review', reviewSchema)