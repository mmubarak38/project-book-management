const aws = require("aws-sdk");
const userModel = require("../models/userModel");

aws.config.update({
  accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
  secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
  region: "ap-south-1" // Mumbai region
});


// this function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) { // exactly 
    
    // Create S3 service object
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });
    var uploadParams = {
      ACL: "public-read", // this file is publically readable
      Bucket: "classroom-training-bucket", // HERE
      Key: "Radium/mmubarak38/booktTitle/" + new Date() + file.originalname, // HERE    "pk_newFolder/harry-potter.png" pk_newFolder/harry-potter.png
      Body: file.buffer, 
    };

    // Callback - function provided as the second parameter ( most oftenly)
     s3.upload(uploadParams , function (err, data) {
      if (err) {
        return reject( { "error": err });
      }
      console.log(data)
      console.log(`File uploaded successfully. ${data.Location}`);
      return resolve(data.Location); //HERE 
    });
  });
};

const bookCoverUrl= async function (req, res) {
  try {
    let files = req.files;
    if (files && files.length > 0) {
      //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
      let uploadedFileURL = await uploadFile( files[0] ); // expect this function to take file as input and give url of uploaded file as output 
      res.status(201).send({ status: true, data: uploadedFileURL });

    } 
    else {
      res.status(400).send({ status: false, msg: "No file to write" });
    }

  } 
  catch (e) {
    console.log("error is: ", e);
    res.status(500).send({ status: false, msg: "Error in uploading file to s3" });
  }

};

module.exports.bookCoverUrl = bookCoverUrl