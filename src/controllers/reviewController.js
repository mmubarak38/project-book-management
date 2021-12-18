const mongoose = require('mongoose')
const reviewModel=require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const { findOneAndUpdate } = require('../models/reviewModel')


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

const isValidRating = function (value ) {
    if (value<1){
        return false
    }else if(value> 5){
        return false
    }else{
        return true
    }
    
}


const createReview= async function(req,res){
  try{

     const requestBody=req.body
     if(!isValidRequestBody(requestBody)) {
        res.status(400).send({status: false, message: 'Invalid request parameters. Please provide review details'})
        return
    }
    let  bookId=req.params.bookId
    let {reviewedBy,reviewedAt,rating,review,}=requestBody

    if(!isValid(bookId)) {
        res.status(400).send({status: false, message: 'BookId is required'})
        return
    }
    if(!isValidObjectId(bookId)) {
        res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
        return
    }

    if(!isValid(reviewedBy)) {
        res.status(400).send({status: false, message: 'reviewedBy is required'})
        return
    }

    // if(!isValid(reviewedAt)) {
    //     res.status(400).send({status: false, message: 'reviewedAt is required'})
    //     return
    // }

    if(!isValid(rating)) {
        res.status(400).send({status: false, message: 'rating is required'})
        return
    }

    if(!isValidRating(rating)){
        res.status(400).send({status: false, message: `you have to give rating between 1 to 5`})
        return
    }

    if(!isValid(review)) {
        res.status(400).send({status: false, message: 'review is required'})
        return
    }


    const book = await bookModel.findOne({_id:bookId, isDeleted:false, detetedAt:null});

    if(!book) {
        res.status(400).send({status: false, message: `book does not exit`})
        return
    }

    //review, rating, reviewer's name in request body.
     const reviewData= {bookId,reviewedBy,reviewedAt:new Date(),rating,review}
    const newReview = await reviewModel.create(reviewData);
    
    const reviewId=newReview._id
   const bookDetails= await bookModel.findOneAndUpdate({_id:bookId,},{reviews:book.reviews+1},{new:true})
   
   const revData = await reviewModel.find({bookId}).select({"_id":1, "bookId":1,"reviewedBy": 1,"reviewedAt": 1,"rating": 1,"review":1 })

   if (revData.length == 0) {

    const reviewsData = "No one reviewed this book"
    const bookList=bookDetails
    const data = { bookList, reviewsData ,revData}
    return res.status(200).send({ status: true, message:"book list " ,data: data })

}

       const reviewsData = revData
       const bookList=bookDetails
        const data = { bookList, reviewsData }
        return res.status(200).send({ status: true, message:"book list",  data: data })
}

catch(error){
    res.status(500).send({status: false, message: error.message});
}

}



const updateReview= async function(req,res){
    try{

        const requestBody=req.body
        if(!isValidRequestBody(requestBody)) {
           res.status(400).send({status: false, message: 'Invalid request parameters. Please provide review details'})
           return
       }
       let bookId=req.params.bookId
       let reviewId=req.params.reviewId
       let {reviewedBy,rating,review}=requestBody
   
       if(!isValid(bookId)) {
           res.status(400).send({status: false, message: 'BookId is required'})
           return
       }
       if(!isValidObjectId(bookId)) {
           res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
           return
       }

       if(!isValid(reviewId)) {
        res.status(400).send({status: false, message: 'reviewId is required'})
        return
    }
    if(!isValidObjectId(reviewId)) {
        res.status(400).send({status: false, message: `${reviewId} is not a valid review id`})
        return
    }

    if(!isValid(reviewedBy)) {
        res.status(400).send({status: false, message: 'reviewedBy is required'})
        return
    }


    if(!isValid(rating)) {
        res.status(400).send({status: false, message: 'rating is required'})
        return
    }

    if(!isValidRating(rating)){
        res.status(400).send({status: false, message: `you have to give rating between 1 to 5`})
        return
    }

    if(!isValid(review)) {
        res.status(400).send({status: false, message: 'rating is required'})
        return
    }


    const book = await bookModel.findOne({_id:bookId, isDeleted:false, detetedAt:null});

    if(!book) {
        res.status(400).send({status: false, message: `book does not exit`})
        return
    }

    const review1 = await reviewModel.findOne({_id:reviewId, isDeleted:false});

    if(!review1) {
        res.status(400).send({status: false, message: `review does not exit`})
        return
    }

    const bookDetails= await bookModel.findOne({_id:bookId})

    
    const revData=await reviewModel.findByIdAndUpdate({_id:reviewId,},{reviewedBy:reviewedBy,rating:rating,review:review ,reviewedAt:new Date()},{new:true}).select({"_id":1, "bookId":1,"reviewedBy": 1,"reviewedAt": 1,"rating": 1,"review":1 })

    

    const allReview = await reviewModel.find({bookId}).select({"_id":1, "bookId":1,"reviewedBy": 1,"reviewedAt": 1,"rating": 1,"review":1 })


    if (allReview.length == 0) {

        const reviewsData = "No one reviewed this book"
        const bookList=bookDetails
        const data = { bookList, reviewsData }
        return res.status(200).send({ status: true, message:"book list " ,data: data })
    
    }
    
           const reviewsData = allReview
           const bookList=bookDetails
            const data = { bookList, reviewsData }
            return res.status(200).send({ status: true, message:"book list",  data: data })
    
    //res.status(200).send({status: true, message: 'review updated successfully', data: revData})


    }catch(error){
    res.status(500).send({status: false, message: error.message});
}
}



const deleteReview= async function(req,res){
    try{


        let bookId=req.params.bookId
        let reviewId=req.params.reviewId

        // if(!isValid(bookId)) {
        //     res.status(400).send({status: false, message: 'BookId is required'})
        //     return
        // }
        if(!isValidObjectId(bookId)) {
            res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
            return
        }
 
    //     if(!isValid(reviewId)) {
    //      res.status(400).send({status: false, message: 'reviewId is required'})
    //      return
    //  }
     if(!isValidObjectId(reviewId)) {
         res.status(400).send({status: false, message: `${reviewId} is not a valid review id`})
         return
     }

        const book = await bookModel.findOne({_id:bookId, isDeleted:false, detetedAt:null});

        if(!book) {
            res.status(400).send({status: false, message: `book does not exit`})
            return
        }

        const review = await reviewModel.findOne({_id:reviewId, isDeleted:false});

    if(!review) {
        res.status(400).send({status: false, message: `review does not exit`})
        return
    }

    const reviewDele=await reviewModel.findOneAndUpdate({_id:reviewId},{isDeleted:true})

    const bookDetails= await bookModel.findOneAndUpdate({_id:bookId,},{reviews:book.reviews-1},{new:true})

    res.status(200).send({status:true,message:"review deleted successfully"})

    }catch(error){
    res.status(500).send({status: false, message: error.message});
}
}


module.exports={createReview,updateReview,deleteReview}