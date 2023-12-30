import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'APNI-Coaching',
      version: '1.0.0',
      description: 'This is backend following MVC architeture of Apni-Coaching server',
    },
  },
  apis: ['./routes/*.ts'], 
};

export const specs = swaggerJsdoc(options);


