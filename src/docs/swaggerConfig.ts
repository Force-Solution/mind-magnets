import YAML from 'yamljs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
const swaggerDefinitions = YAML.load(path.join(__dirname, 'swagger.yaml'));
const options = {
  swaggerDefinition: swaggerDefinitions,

  apis: ['./controllers/*.ts'],
};
export const specs = swaggerJsdoc(options);
