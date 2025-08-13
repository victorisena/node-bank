import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NodeBank API Documentation",
      version: "1.0.0",
      description: "Documentation for NodeBank API",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development Server"
      },
    ],
  },
  apis: ["src/routes/*.ts"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };