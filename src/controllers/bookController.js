const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const reviewModel=require('../models/reviewModel')

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const validateDate =function(value)
{

    var pattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
    if (value == null || value == "" || !pattern.test(value)) {
        //errMessage += "Invalid date of birth\n";
        return false;
    }
    else {
        return true
    }
}

const createBook = async function (req, res) {
    try {
        const requestBody = req.body;
        const userIdFromToken=req.userId

        if(!isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide book details'})
            return
        }

        if(!isValidObjectId(userIdFromToken)) {
            res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
            return
        }


        // Extract params
        const {title,bookCover, excerpt, userId, ISBN, category, subcategory, releasedAt} = requestBody;
        
        // Validation starts

        if(!isValid(title)) {
            res.status(400).send({status: false, message: 'Book Title is required'})
            return
        }

        const isTitleAlreadyUsed = await bookModel.findOne({title}); // {title:title}

        if(isTitleAlreadyUsed) {
            res.status(400).send({status: false, message: `${title} title is already registered`})
            return
        }
        if(!isValid(bookCover)) {
            res.status(400).send({status: false, message: 'excerpt is required'})
            return
        }

        if(!isValid(excerpt)) {
            res.status(400).send({status: false, message: 'excerpt is required'})
            return
        }

       
        if(!isValid(userId)) {
            res.status(400).send({status: false, message: 'user id is required'})
            return
        }

        if(!isValidObjectId(userId)) {
            res.status(400).send({status: false, message: `${userId} is not a valid user id`})
            return
        }

        const user = await userModel.findById(userId);

        if(!user) {
            res.status(400).send({status: false, message: `user does not exit`})
            return
        }

        if(userId !==userIdFromToken) {
            res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
            return
        }

        if(!isValid(ISBN)) {
            res.status(400).send({status: false, message: 'Book ISBN is required'})
            return
        }

        const isIsbnAlreadyUsed= await bookModel.findOne({ISBN})
        if(isIsbnAlreadyUsed) {
            res.status(400).send({status: false, message: `${ISBN} ISBN address is already registered`})
            return
        }

        if(!isValid(category)) {
            res.status(400).send({status: false, message: 'Book category is required'})
            return
        }

        if(!isValid(subcategory)) {
            res.status(400).send({status: false, message: ' subcategory is required'})
            return
        }

        if(!isValid(releasedAt)) {
            res.status(400).send({status: false, message: 'Book released date is required'})
            return
        }
        if(!validateDate(releasedAt)){
            res.status(400).send({status: false, message: 'releasedAt should be an date and format("YYYY-MM-DD")'})
            return
        }
       
        
        // Validation ends
        const reviews = 0;
       
        const bookData = {
            title, 
            bookCover,
            excerpt, 
            userId, 
            ISBN, 
            category, 
            subcategory,
            reviews,
            releasedAt
        }
    
        const createdBook = await bookModel.create(bookData)
        return res.status(201).send({status: true, message: 'New book created successfully', data: createdBook})
    } 
    catch (error) {
        console.log(error)
        res.status(500).send({status: false, message: error.message});
    }
}





const getBooks=async function(req,res){

    try{
         const queryParams=req.query
        let filterQuery={isDeleted:false,deletedAt:null}
        let {userId, category,subcategory}=queryParams

            
            if (userId) {
                filterQuery["userId"] = userId
            }
            if (category) {
                filterQuery["category"] = category
            }
            
            if (subcategory) {
                filterQuery["subcategory"] = subcategory
            }

            let book = await bookModel.find(filterQuery)
            const book1 = await bookModel.find(filterQuery).select({ "_id": 1, "title": 1, "excerpt": 1, "userId": 1 ,"category":1,"releasedAt":1,"reviews":1 }).sort({"title":1})
           
            // function SortArray(x, y){                                            //discuss with mentor // we can sort in mongodb also by using .sor(title)
            //     if (x.title < y.title) {return -1;}
            //     if (x.title > y.title) {return 1;}
            //     return 0;
            // }
            
            // const book2 = book1.sort(SortArray);
	          
            if (book.length > 0) {
              res.status(200).send({ status: true,message:'Books list', data: book1 })
            }
            else {
              res.status(404).send({ msg: "book not find" })
            }
          
    }catch(error){
        res.status(500).send({status:true,message:error.message})
    }

}

const getBooksById = async function (req, res) {

    const _id = req.params.bookId

    if(!isValid(_id)) {
        res.status(400).send({status: false, message: 'bookId id is required'})
        return
    }


    if (!isValidObjectId(_id)) {
        res.status(400).send({ status: false, message: "bookId should be valid" })
        return
    }

    let bookDetails = await bookModel.findOne({ _id, isDeleted: false })
    if (!bookDetails) {
        res.status(404).send({ status: false, message: "No book found" })
        return
    }
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, deletedAt, isDeleted, updatedAt, reviews, createdAt } = bookDetails
    const reviewData = await reviewModel.find({ bookId: _id, isDeleted: false })
    const book = { _id, reviews, title, excerpt, userId, ISBN, category, subcategory,  releasedAt, deletedAt, isDeleted, updatedAt, createdAt ,reviewsData: reviewData}
    return res.status(200).send({ status: true, message: 'Books list', data: book })
}




const updateBook = async function (req, res) {
    try {
        const _id = req.params.bookId
        let requestBody = req.body
        const userIdFromToken=req.userId

        //console.log(userIdFromToken)

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Please provide valid data in request body" })
            return
        }

        if (!isValidObjectId(_id)) {
            res.status(400).send({ status: false, message: "bookId should be valid" })
            return
        }

        let bookDetails = await bookModel.findOne({ _id, isDeleted: false })
        
        if (!bookDetails) {
            res.status(404).send({ status: false, message: "No book found" })
            return
        }
        let { title, excerpt, ISBN, releasedAt } = requestBody
        let updateData = {}


        if (bookDetails.userId.toString() !== userIdFromToken) {
            res.status(401).send({ status: false, message: "You are not authorised" })
            return
        }

        if (title) {

            if (!isValid(title)) {
                res.status(400).send({ status: false, message: "Title should have some value" })
                return
            }
      

           title = String.prototype.trim.call(title)
            let isTitleAlreadyUsed = await bookModel.findOne({ title })

            if (isTitleAlreadyUsed) {
                res.status(400).send({ status: false, message: "Title is already in use, try something different" })
                return
            }
            updateData['title'] = title
        }
       
            if (!isValid(excerpt)) {
                res.status(400).send({ status: false, message: "excerpt should have some value" })
                return
            }
            excerpt = excerpt.trim()
            updateData['excerpt'] = excerpt

      
            if (!isValid(ISBN)) {
                res.status(400).send({ status: false, message: "ISBN should have some value" })
                return
            }

            ISBN = String.prototype.trim.call(ISBN)
            let isIsbnAlreadyUsed = await bookModel.findOne({ ISBN })

            if (isIsbnAlreadyUsed) {
                res.status(400).send({ status: false, message: "ISBN is already in use, try something different" })
                return
            }
            updateData['ISBN'] = ISBN 

        
            if (!Date.parse(releasedAt)) {
                res.status(400).send({ status: false, message: `releasedAt should be an date and format("YYYY-MM-DD")` })
                return
            }
            updateData['releasedAt'] = releasedAt
        

        if (!isValidRequestBody(updateData)) {
            res.status(400).send({ status: false, message: "Please provide correct updating data " })
            return
        }

      
        let udatedBookDetails = await bookModel.findOneAndUpdate({ _id }, updateData, { new: true })
        return res.status(200).send({ status: true, message: 'Book details updated successfully', data: udatedBookDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


const deleteBookByID = async function (req, res) {
    try {
        const params = req.params
        const bookId = params.bookId
        const userIdFromToken = req.userId

       

        if(!isValidObjectId(bookId)) {
            res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
            return
        }

        if(!isValidObjectId(userIdFromToken)) {
            res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
            return
        }
       
        const Book = await bookModel.findOne({_id: bookId, isDeleted: false, deletedAt: null })

        if(!Book) {
            res.status(404).send({status: false, message: `Book not found`})
            return
        }
        if(Book.userId.toString() !== userIdFromToken) {
            res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
            return
        }



     await bookModel.findOneAndUpdate({_id: bookId}, {$set: {isDeleted: true, deletedAt: new Date()}})
        res.status(200).send({status: true, message: `Book deleted successfully`})
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}


module.exports={createBook, getBooks, getBooksById,updateBook, deleteBookByID}