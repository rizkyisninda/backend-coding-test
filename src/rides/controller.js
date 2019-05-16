'use strict'

const RideUsecase = require('./usecase')

class RidesController {
    async postData (req, res, err, db) {
        const result = await new RideUsecase(req).postData(db)
        return res.json(result)
    }

    async getDataById(req, res, err, db) {
        const result = await new RideUsecase(req).getDataById(db)
        return res.json(result)
    }

    async getData(req, res, err, db) {
        const result = await new RideUsecase(req).getPaginationData(db)
        return res.json(result)
    }
}

module.exports = RidesController
