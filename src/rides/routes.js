
module.exports.setup = function (app, jsonParser, db) {
    const RiderController = require('./controller')
    const ridesController = new RiderController()
    app.get('/health', jsonParser, (req, res) => res.send('Healthy'))

    /**
     * @swagger
     * /rides:
     *   post:
     *     tags:
     *       -  post create rides
     *     description: create rides data
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *        - name: body
     *          in: body
     *          description: A JSON payload containing the data required to create a new rides.
     *          required: true
     *          schema:
     *             type: object
     *             properties:
     *                start_lat:
     *                  required: true
     *                  type: integer
     *                  example: 20
     *                start_long:
     *                  required: true
     *                  type: integer
     *                  example: 20
     *                end_lat:
     *                  required: true
     *                  type: integer
     *                  example: 20
     *                end_long:
     *                  required: true
     *                  type: integer
     *                  example: 20
     *                rider_name:
     *                  required: true
     *                  type: string
     *                  example: "test1"
     *                driver_name:
     *                  required: true
     *                  type: string
     *                  example: "test2"
     *                driver_vehicle:
     *                  required: true
     *                  type: string
     *                  example: "test3"
     *
     *     responses:
     *       200:
     *         description: Successfully create rides data
     */
    app.post('/rides', jsonParser, (req, res, err) => ridesController.postData(req, res, err, db))

    /**
    * @swagger
    * /rides:
    *   get:
    *     description: Returns Rides Data
    *     tags:
    *      - Get Rides Data All
    *     produces:
    *      - application/json
    *     responses:
    *       200:
    *         description: rides
    */
    app.get('/rides/:id', jsonParser, (req, res, err) => ridesController.getDataById(req, res, err, db))

    /**
     * @swagger
     * /rides/{id}:
     *   get:
     *     description: get rides data by id
     *     tags:
     *      - Get data Rides By Id
     *     parameters:
     *       - name: id
     *         description: rides data id
     *         in: path
     *         type: integer
     *         required: true
     *         example: 1
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Success get  data rides
     *
     */
    app.get('/rides', jsonParser, (req, res, err) => ridesController.getData(req, res, err, db))
}