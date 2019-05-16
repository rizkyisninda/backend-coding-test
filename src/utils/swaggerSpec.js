
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerDefinition = {
    info: {
        title: 'Backend Node Test',
        version: '1.0.0',
        description: '',
    },
    host: 'localhost:8010',
    basePath: '',
};


const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./src/routes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec