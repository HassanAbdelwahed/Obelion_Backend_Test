const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Library Management API",
    version: "1.0.0",
    description: "API documentation for the Library Management System",
  },
  servers: [
    {
      url: "http://localhost:8800", // The base URL of your API
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    schemas: {
      Book: {
        type: "object",
        required: ["title", "author", "totalCopies"],
        properties: {
          title: {
            type: "string",
            description: "The title of the book",
          },
          author: {
            type: "string",
            description: "The author of the book",
          },
          totalCopies: {
            type: "number",
            description: "The total number of copies",
          },
          copiesAvailable: {
            type: "number",
            description: "Number of copies currently available",
          },
        },
      },
      User: {
        type: "object",
        required: ["username", "email", "password", "passwordConfirm"],
        properties: {
          username: {
            type: "string",
            description: "Username of the user",
          },
          email: {
            type: String,
          },
          password: {
            type: "string",
            description: "Password of the user",
          },
          passwordConfirm: {
            type: String,
          },
          role: {
            type: String,
            description: "Take value USER or ADMIN",
          },
        },
      },
      BorrowingHistory: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "The ID of the user",
          },
          bookId: {
            type: "string",
            description: "The ID of the book borrowed",
          },
          borrowedAt: {
            type: "string",
            format: "date-time",
            description: "The date and time the book was borrowed",
          },
          returnedAt: {
            type: "string",
            format: "date-time",
            description: "The date and time the book was returned",
          },
        },
      },
      PopularBooks: {
        type: "object",
        properties: {
          bookId: {
            type: "string",
            description: "The ID of the book",
          },
          borrowCount: {
            type: "number",
            description: "The number of times the book has been borrowed",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["/obelionBackendTest/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
