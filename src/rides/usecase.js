'use strict'

const Response = require('../utils/response')
const Repository = require('../rides/repository')

class RidesUseCase {
    constructor(req) {
        this.req = req
    }

    async postData(db) {
        try {
            const startLatitude = Number(this.req.body.start_lat)
            const startLongitude = Number(this.req.body.start_long)
            const endLatitude = Number(this.req.body.end_lat)
            const endLongitude = Number(this.req.body.end_long)
            const riderName = this.req.body.rider_name
            const driverName = this.req.body.driver_name
            const driverVehicle = this.req.body.driver_vehicle

            if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
                return new Response(
                    false,
                    'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
                    null,
                    'VALIDATION_ERROR'
                )
            }

            if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
                return new Response(
                    false,
                    'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
                    null,
                    'VALIDATION_ERROR'
                )
            }

            if (typeof riderName !== 'string' || riderName.length < 1) {
                return new Response(
                    false,
                    'Rider name must be a non empty string',
                    null,
                    'VALIDATION_ERROR'
                )
            }

            if (typeof driverName !== 'string' || driverName.length < 1) {
                return new Response(
                    false,
                    'Driver name must be a non empty string',
                    null,
                    'VALIDATION_ERROR'
                )
            }

            if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
                return new Response(
                    false,
                    'Driver Vehicle must be a non empty string',
                    null,
                    'VALIDATION_ERROR'
                )
            }

            const dataToInsert = [
                this.req.body.start_lat,
                this.req.body.start_long,
                this.req.body.end_lat,
                this.req.body.end_long,
                this.req.body.rider_name,
                this.req.body.driver_name,
                this.req.body.driver_vehicle
            ]

            const ridesRepository = new Repository()
            const insertData = await ridesRepository.insertDataRides(db, dataToInsert)
            const getData = await ridesRepository.getDataById(db, insertData.lastID)
            return new Response(true, 'success', getData[0], null)
        } catch (error) {
            throw new Response(false, 'Unknown error', null, 'SERVER_ERROR')
        }
    }

    async getDataById(db) {
        try {
            const getData = await new Repository().getDataById(db, this.req.params.id)
            if (getData && getData.length === 0) {
                return new Response(
                    false,
                    'Could not find any rides',
                    null,
                    'RIDES_NOT_FOUND_ERROR'
                )
            }
            return new Response(true, 'success', getData[0], null)
        } catch (error) {
            throw new Response(false, 'Unknown error', null, 'SERVER_ERROR')
        }
    }

    async getPaginationData(db) {
        try {
            const page = (this.req.query && this.req.query.page) ? this.req.query.page : 1
            const limit = (this.req.query && this.req.query.limit) ? this.req.query.limit : 5
            const offset = page > 1 ? ((page * limit) - limit) : 0
            const getData = await new Repository().getDataPagination(db, offset, limit)
            if (getData && getData.length === 0) {
                return new Response(
                    false,
                    'Could not find any rides',
                    null,
                    'RIDES_NOT_FOUND_ERROR'
                )
            }
            const result = {
                'list': getData,
                'page': {
                    'currentPage': page
                }
            }
            return new Response(true, 'success', result, null)
        } catch (error) {
            return new Response(false, 'Unknown error', null, 'SERVER_ERROR')
        }
    }
}

module.exports = RidesUseCase