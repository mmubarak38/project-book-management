const jwt= require('jsonwebtoken')
const userAuth=async function(req,res,next){
    try{

        const token=req.header('x-api-key')
        if(!token){
            res.status(403).send({status:false,message:"Missing Authentication Token in req"})
            return
        }

        const decoded= await jwt.verify(token,'radium')
        if(!decoded){
            res.status(403).send({status:false,message:'invalid Authentication token in request'})
            return
        }
        req.userId=decoded.userId;
        next()

    }catch(error){
        res.status(500).send({status:false,message:error.message})
    }

}


module.exports={userAuth}