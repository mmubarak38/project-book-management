const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const bookController=require('../controllers/bookController')
const reviewController=require('../controllers/reviewController')
const midd=require('../middleWare/middleWare')

// user routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser)

//books routes
router.post('/books',midd.userAuth, bookController.createBook)
router.get('/books',midd.userAuth,bookController.getBooks)
router.get('/books/:bookId',midd.userAuth,bookController.getBooksById)
router.put('/books/:bookId',midd.userAuth,bookController.updateBook)
router.delete('/books/:bookId',midd.userAuth,bookController.deleteBookByID)

//review routes
router.post('/books/:bookId/review', reviewController.createReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)


module.exports = router;