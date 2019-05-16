'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const routes = require('./routes')

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swaggerSpec')

module.exports = (db) => {
   
    routes.setup(app, jsonParser ,db)

    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return app;
};
