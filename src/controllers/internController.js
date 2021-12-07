const internModel = require('../models/internModel')
const collegeModel = require("../models/collegeModel")
const mongoose = require('mongoose')
//https://functionup.s3.ap-south-1.amazonaws.com/radium/ghrcen.png

/*
POST /functionup/interns
Create a document for an intern.

Also save the collegeId along with the document. Your request body contains the following fields - { name, mobile, email, collegeName}

Return HTTP status 201 on a succesful document creation. Also return the document. The response should be a JSON object like this

Return HTTP status 400 for an invalid request with a response body like this
*/

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


const registerIntern = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide author details'})
            return
        }

        // Extract params
        const {name, email,mobile, collegeId,isDeleted} = requestBody; // Object destructing

        // Validation starts
        if(!isValid(name)) {
            res.status(400).send({status: false, message: 'name is required'})
            return
        }
               // mobile validation starts
        if(!isValid(mobile)) {
            res.status(400).send({status: false, message: `mobile no is required`})
            return
        }
        
        if(!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))) {
            res.status(400).send({status: false, message: `mobile no should be valid mobile number`})
            return
        }

        const isMobileAlreadyUsed = await internModel.findOne({mobile}); // {email: email} object shorthand property

        if(isMobileAlreadyUsed) {
            res.status(400).send({status: false, message: `${mobile} mobile no is already registered`})
            return
        }
              // mobile validation ends

              // collegeId is required
              if(!isValid(collegeId)) {
                res.status(400).send({status: false, message: 'collegeId is required'})
                return
            }    
              
              // college Id cheking starts
        if(!isValidObjectId(collegeId)) {
            res.status(400).send({status: false, message: `${collegeId} is not a valid college id`})
            return
        }
        const college = await collegeModel.findById(collegeId);

        if(!college) {
            res.status(400).send({status: false, message: `college id  does not exit`})
            return
        }  
               // college Id cheking ends


        // email validation starts
        if(!isValid(email)) {
            res.status(400).send({status: false, message: `Email is required`})
            return
        }
        
        if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }

        const isEmailAlreadyUsed = await internModel.findOne({email}); // {email: email} object shorthand property

        if(isEmailAlreadyUsed) {
            res.status(400).send({status: false, message: `${email} email address is already registered`})
            return
        }
        // Validation ends


        const savedInterData = {name, email,mobile, collegeId, isDeleted}
        const newIntern = await internModel.create(savedInterData);
        res.status(201).send({status: true, message: `intern is created successfully`, data: newIntern});


    } 



    catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}






module.exports.registerIntern = registerIntern;
