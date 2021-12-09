const collegeModel = require("../models/collegeModel")
const internModel = require('../models/internModel')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

// const ValidURL = function (userInput) {
//     var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
//     if (res == null)
//         return false;
//     else
//         return true;
// }
const isImgLink= function (url) {
    if(typeof url !== 'string') return false;
    return(url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
}



const createCollege = async function (req, res) {
    try {
        // Validation starts
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }
            let  { name, fullName, logoLink, isDeleted } = requestBody; // Object destructing


        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        name = name.trim();

        let isNameAlreadyUsed = await collegeModel.findOne({name}); 

        if(isNameAlreadyUsed) {
            res.status(400).send({status: false, message: `${name} is already registered`})
            return
        }

        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: 'fullName is required' })
            return
        }

        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: 'logolink is required' })
            return
        }
        if (!isImgLink(logoLink)) {
            res.status(400).send({ status: false, message: 'invalid logolink' })
            return
        }
       // console.log(ValidURL(logoLink))
    //    if (isDeleted) {  ///(isDeleted = true) or ==  or ===
    //     res.status(400).send({ status: false, message: "Cannot input isDeleted as true while registering" })
    //     return
    //      }
        // Validation end

        const Data = { name, fullName, logoLink, isDeleted }
        let savedData = await collegeModel.create(Data)
        console.log(savedData)
        res.status(201).send({ status: true, data: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error })//specifies which error 
        console.log(error)
    }
}
module.exports.createCollege = createCollege;


/*
GET /functionup/collegeDetails
Returns the college details for the requested college (Expect a query parameter by the name collegeName. This is anabbreviated college name. For example iith)
Returns the list of all interns who have applied for internship at this college.
The response structure should look like this
*/



//Q 3 
const getAllIntern = async function (req, res) {
    try {



        let collegeName = req.query.collegeName;
        
        if (!collegeName) {
           return res.status(400).send({ status: false, msg: 'put CollegeName' })
        }

        let collegeDetail = await collegeModel.findOne({ name: collegeName , isDeleted: false })

        if (!collegeDetail)
             {
            return res.status(400).send({ status: false, msg: 'college name not present' })//ask to mentor
        }

        console.log(collegeDetail._id)

        let internDetail = await internModel.find({ collegeId: collegeDetail._id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        console.log(internDetail)

      let result = {
            name: collegeDetail.name,
            FullName: collegeDetail.fullName,
            LogoLink: collegeDetail.logoLink,

        }
        // if (internDetail.length === 0) {
        //     return res.status(201).send({ status: true, result, msg: 'intern Details not present' })
        // }

        let result2 = {
            name: collegeDetail.name,
            FullName: collegeDetail.fullName,
            LogoLink: collegeDetail.logoLink,
            interests: internDetail
        }
         // if (!result2) {
        //     res.status(400).send({ status: false, msg: 'data is not present' })
        // }
         
        if (internDetail.length === 0) {
            return res.status(201).send({ status: true, result, msg: 'intern Details not present' })
        }else{
            res.status(200).send({status: true, data: result2})
        }

        
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.getAllIntern = getAllIntern;



// console.log(isImgLink('https://example.com/img.jpg')); // true
// console.log(isImgLink('https://example.com/any-route?param=not-img-file.jpg')); // false
// console.log(isImgLink('https://example.com/img.jpg?param=123')); // true