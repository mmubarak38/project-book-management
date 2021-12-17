const express = require('express');
const userController= require('../controllers/userController')
const bookController = require('../controllers/bookController')
const mid1 =require('../middleware/mid1')

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/createBook',bookController.createBook)






module.exports = router;