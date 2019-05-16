
module.exports.setup = function (app, jsonParser ,db) {
    app.get('/health', (req, res) => res.send('Healthy'));

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
    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.send(rows);
            });
        });
    });


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
    app.get('/rides', (req, res) => {
        const page = (req.query && req.query.page) ? req.query.page : 1
        const limit = (req.query && req.query.limit) ? req.query.limit : 5
        const offset = (page - 1) * limit;
        db.all('SELECT * FROM Rides LIMIT ?, ?', [offset, limit], function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

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
    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

};