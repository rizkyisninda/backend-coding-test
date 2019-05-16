'use strict'

const BaseRepository = require('../utils/baseRepository')

const Response = require('../utils/response')

class RidesRepository extends BaseRepository {
    async insertDataRides(db, data) {
        try {
            const result = await this.queryInsert(
                db,
                'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
                data
            )
            return result
        } catch (error) {
            throw new Response(false, 'Unknown error', null, 'SERVER_ERROR')
        }
    }

    async getDataById(db, id) {
        try {
            const result = await this.querySelect(
                db,
                'SELECT * FROM Rides WHERE rideID = ?',
                id
            )
            return result
        } catch (error) {
            throw new Response(false, 'Unknown error', null, 'SERVER_ERROR')
        }
    }

    async getDataPagination(db, offset, limit) {
        try {
            const result = await this.querySelect(
                db,
                'SELECT * FROM Rides LIMIT ?, ?',
                [offset, limit]
            )
            return result
        } catch (error) {
            return new Response(false, 'Unknown error', null, 'SERVER_ERROR')
        }
    }
}

module.exports = RidesRepository