const bookModel = require('../model/bookModel');
const userModel = require('../model/userModel');
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const createBook = async function (req, res) {
    const requestBody = req.body
    let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = requestBody
    if (!isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: "Please provide valid request body" })
        return
    }
    if (!isValid(title)) {
        res.status(400).send({ status: false, message: "Title is required" })
        return
    }
    title = String.prototype.trim.call(title)
    const isTitleAlreadyUsed = await bookModel.findOne({ title })
    if (isTitleAlreadyUsed) {
        res.status(400).send({ status: false, message: "Title is already in use, try something different" })
        return
    }
    if (!isValid(excerpt)) {
        res.status(400).send({ status: false, message: "Excerpt is required" })
        return
    }
    if (!isValid(userId)) {
        res.status(400).send({ status: false, message: "userId is required" })
        return
    }
    if (!isValidObjectId(userId)) {
        res.status(400).send({ status: false, message: "userId should be valid" })
        return
    }
    ISBN = String.prototype.trim.call(ISBN)
    if (!isValid(ISBN)) {
        res.status(400).send({ status: false, message: "ISBN is required" })
        return
    }
    const isIsbnAlreadyUsed = await bookModel.findOne({ ISBN })
    if (isIsbnAlreadyUsed) {
        res.status(400).send({ status: false, message: "ISBN is already in use, try something different" })
        return
    }
    if (!isValid(category)) {
        res.status(400).send({ status: false, message: "category is required" })
        return
    }
    if (!isValid(subcategory)) {
        res.status(400).send({ status: false, message: "subcategory is required" })
        return
    }
    if (!isValid(releasedAt)) {
        res.status(400).send({ status: false, message: "releasedAt is required" })
        return
    }
    const isUserExist = await userModel.findOne({ userId })
    if (!isUserExist) {
        res.status(404).send({ status: false, message: "User doesn't exist" })
    }
    const bookDetails = await bookModel.create(requestBody)
}
module.exports = { createBook }