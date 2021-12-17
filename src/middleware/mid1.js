const jwt = require("jsonwebtoken")
const middleWare = async function(req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            return res.send({ status: false, Message: 'No token found' })
        } else {
            let decodedtoken = jwt.verify(token, 'Group2') 
            if (decodedtoken) {
                req.decodedtoken = decodedtoken; 
                next();
            } else {
                res.status(404).send({ Message: "Not valid Token" })
            }
        }
    } catch (err) {
        res.status(404).send({ status: false, msg: err.message })
    }
}
module.exports={middleWare}
