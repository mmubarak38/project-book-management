const collegeModel = require('../models/collegeModel')

const createCollege = async function (req, res) {
    try {
        let data = req.body
        let savedData = await collegeModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: 'some thing went wrong' })

    }
}


module.exports.createCollege = createCollege;
