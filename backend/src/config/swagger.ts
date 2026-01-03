import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import * as glob from 'glob';
const routePattern = './**/*/**/*Routes.ts';

// Get all files matching the pattern
const routeFiles = glob.sync(routePattern);
const url = process.env.BASE_URL || 'https://staging-api.hp-tech.com/';

const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Leadify API',
      version: '1.0.0',
      description: 'Documentation for leadify API'
    },
    servers: [
      {
        url,
        description: 'Server URL'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [path.join(__dirname, '../routes/*.ts'), ...routeFiles.map(file => path.resolve(file))]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
