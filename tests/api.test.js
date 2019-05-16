'use strict'
/* eslint-disable */
let chai = require('chai')
const chaiHttp = require('chai-http')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const Log = require('../src/utils/log')
const Response = require('../src/utils/response')

const app = require('../src/app')(db)
const buildSchemas = require('../src/schemas')
const expect = chai.expect

chai.use(chaiHttp)
describe('API TEST', function () {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err)
            }
            buildSchemas(db)
            return done()
        })
    })

    describe('GET /health', () => {
        it('should return health', (done) => {
            chai.request(app)
                .get('/health')
                .end(function (err, res) {
                    if (err) {

                    }
                    expect(res).to.have.status(200)
                    done()
                })
        })
    })

    describe('GET rides pagination data', () => {
        it('should get rides data pagination is empty', (done) => {
            chai.request(app)
                .get('/rides')
                .end(function (err, res) {
                    if (err) {
                        Log.error(new Error(err.message))
                        done(err)
                    }
                    expect(res).to.have.status(200)
                    expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(new Response(
                        false,
                        'Could not find any rides',
                        null,
                        'RIDES_NOT_FOUND_ERROR'
                    )))
                    done()
                })
        })
    })

    describe('GET rides one data', () => {
        it('should get rides data one is empty', (done) => {
            chai.request(app)
                .get('/rides/1')
                .end(function (err, res) {
                    if (err) {
                        Log.error(err)
                        done(err)
                    }
                    expect(res).to.have.status(200)
                    expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(new Response(
                        false,
                        'Could not find any rides',
                        null,
                        'RIDES_NOT_FOUND_ERROR'
                    )))
                    done()
                })
        })
    })

    describe('POST rides data', () => {
        it('should post rides data', (done) => {
            chai.request(app)
                .post('/rides')
                .send({
                    start_lat: 80,
                    start_long: 70,
                    end_lat: 20,
                    end_long: 30,
                    rider_name: 'test1',
                    driver_name: 'test2',
                    driver_vehicle: 'test3'
                })
                .end(function (err, res) {
                    if (err) {
                        Log.error(err)
                        done(err)
                    }
                    expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
                    expect(res).to.have.status(200)
                    expect(res.body).to.not.be.empty
                    expect(res.body.success).to.equal(true)
                    expect(res.body.data).to.not.be.empty
                    expect(res.body.data.startLat).to.equal(80)
                    expect(res.body.data.startLong).to.equal(70)
                    expect(res.body.data.riderName).to.equal('test1')
                    expect(res.body.data.driverName).to.equal('test2')
                    expect(res.body.data.driverVehicle).to.equal('test3')
                    done()
                })
        })
    })

    describe('GET rides one data', () => {
        it('should get rides data one is not empty', (done) => {
            chai.request(app)
                .get('/rides/1')
                .end(function (err, res) {
                    if (err) {
                        Log.error(err)
                        done(err)
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.not.be.empty
                    expect(res.body.success).to.equal(true)
                    expect(res.body.data).to.not.be.empty
                    done()
                })
        })
    })

    describe('GET rides pagination data', () => {
        it('should get rides data pagination is not empty', (done) => {
            chai.request(app)
                .get('/rides?page=1&limit=20')
                .end(function (err, res) {
                    if (err) {
                        Log.error(err)
                        done(err)
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.not.be.empty
                    expect(res.body.success).to.equal(true)
                    expect(res.body.data).to.not.be.empty
                    done()
                })
        })
    })

    describe('POST /rides validation start latitude and longitude', function () {
        it('responds with status 200 dan validation error', function (done) {
            const data = {
                start_lat: -210,
                start_long: 220,
                end_lat: 0,
                end_long: 1,
                rider_name: 'test1',
                driver_name: 'test2',
                driver_vehicle: 'test3'
            }
            testValidation(data, 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
            done()
        })
    })

    describe('POST /rides validation end latitude and longitude', function () {
        it('responds with status 200 dan validation error', function (done) {
            const data = {
                start_lat: 20,
                start_long: 30,
                end_lat: 220,
                end_long: -230,
                rider_name: 'test1',
                driver_name: 'test2',
                driver_vehicle: 'test3'
            }
            testValidation(data, 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
            done()
        })
    })

    describe('POST /rides validation empty rider name', function () {
        it('responds with status 200 dan validation error', function (done) {
            const data = {
                start_lat: 23,
                start_long: 12,
                end_lat: 20,
                end_long: 20,
                rider_name: '',
                driver_name: 'test2',
                driver_vehicle: 'test3'
            }
            testValidation(data, 'Rider name must be a non empty string')
            done()
        })
    })

    describe('POST /rides validation empty driver name', function () {
        it('responds with status 200 dan validation error', function (done) {
            const data = {
                start_lat: 10,
                start_long: 23,
                end_lat: 20,
                end_long: 11,
                rider_name: 'test1',
                driver_name: '',
                driver_vehicle: 'test3'
            }
            testValidation(data, 'Driver name must be a non empty string')
            done()
        })
    })

    describe('POST /rides validation empty driver vehicle name', function () {
        it('responds with status 200 dan validation error', function (done) {
            const data = {
                start_lat: 11,
                start_long: 22,
                end_lat: 11,
                end_long: 23,
                rider_name: 'test1',
                driver_name: 'test2',
                driver_vehicle: ''
            }
            testValidation(data, 'Driver Vehicle must be a non empty string')
            done()
        })
    })
})

function testValidation(data, errorMessage) {
    chai.request(app)
        .post('/rides')
        .send(data)
        .end(function (err, res) {
            if (err) {
                Log.error(err)
                done(err)
            }
            expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(res).to.have.status(200)
            expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify(new Response(
                false,
                errorMessage,
                null,
                'VALIDATION_ERROR'
            )))
        })
}