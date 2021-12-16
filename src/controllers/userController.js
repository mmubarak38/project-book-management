const userModel = require('../models/userModel')
const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidTitle = function(title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

const isValidphone = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value != type) return false
    return true;
}
const isValidPassword = function (value ) {
    if (value.length<8){
        return false
    }else if(value.length> 15){
        return false
    }else{
        return true
    }
}
const registerUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide author details'})
            return
        }
        // Extract params
        const {title , name,  phone, email, password, address} = requestBody; // Object destructing
        // Validation starts
        
        if(!isValid(title)) {
            res.status(400).send({status: false, message: 'Title is required'})
            return
        }
       

        if(!isValidTitle(title)) {
            res.status(400).send({status: false, message: `Title should be among Mr, Mrs, Miss and Mast`})
            return
        }
        if(!isValid(name)) {
            res.status(400).send({status: false, message: ' name is required'})
            return
        }
        

        if (!isValidphone(phone, 'number')) {
            res.status(400).send({ status: false, message: "phone number is required" })
            return
        }
        //mobile number validation
        if (!(/^\d{10}$/.test(phone))) {
            res.status(400).send({ status: false, message: `phone number  should be a valid` })
            return
        }
        if(!isValid(email)) {
            res.status(400).send({status: false, message: `Email is required`})
            return
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }
        if(!isValid(password)) {
            res.status(400).send({status: false, message: `Password is required`})
            return
        }
        if(!isValidPassword(password)){
            res.status(400).send({status: false, message: `Password must contain characters between 8 to 15`})
            return
        }
        const isEmailAlreadyUsed = await userModel.findOne({email}); // {email: email} object shorthand property
        if(isEmailAlreadyUsed) {
            res.status(400).send({status: false, message: `${email} email address is already registered`})
            return
        }
        const isphoneAlreadyUsed = await userModel.findOne({phone})
        if (isphoneAlreadyUsed) {
            res.status(400).send({status:false, message :"phone number is already used, try another one"})
            return
        }
        // Validation ends
        const userData = {title, name, phone, email, password, address}
        const newUser = await userModel.create(userData);
        res.status(201).send({status: true, message: `user created successfully`, data: newUser});
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}
module.exports = {
    registerUser
}