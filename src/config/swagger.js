const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { API_VERSION } = require('../constants');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tuk-Tuk Tracking API',
      version: '1.0.0',
      description: 'RESTful API for Real-Time Three-Wheeler (Tuk-Tuk) Tracking & Movement Logging System',
      contact: {
        name: 'COBSCCOMP242P-055',
      },
    },
    servers: [
      {
        url: `http://localhost:3000/api/${API_VERSION}`,
        description: 'Development server',
      },
      {
        url: `/api/${API_VERSION}`,
        description: 'Production server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            username: {
              type: 'string',
              description: 'Username for login',
            },
            email: {
              type: 'string',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['admin', 'operator', 'viewer'],
              description: 'User role',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'User status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Province: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique province identifier',
            },
            name: {
              type: 'string',
              description: 'Province name',
            },
            code: {
              type: 'string',
              description: 'Province code',
            },
          },
        },
        District: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique district identifier',
            },
            name: {
              type: 'string',
              description: 'District name',
            },
            provinceId: {
              type: 'string',
              description: 'Reference to parent province',
            },
            code: {
              type: 'string',
              description: 'District code',
            },
          },
        },
        PoliceStation: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique police station identifier',
            },
            name: {
              type: 'string',
              description: 'Police station name',
            },
            districtId: {
              type: 'string',
              description: 'Reference to parent district',
            },
            contactNumber: {
              type: 'string',
              description: 'Police station contact number',
            },
            latitude: {
              type: 'number',
              description: 'Station latitude',
            },
            longitude: {
              type: 'number',
              description: 'Station longitude',
            },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique vehicle identifier',
            },
            registrationNumber: {
              type: 'string',
              description: 'Vehicle registration plate number',
            },
            deviceId: {
              type: 'string',
              description: 'GPS tracking device identifier',
            },
            driverId: {
              type: 'string',
              description: 'Reference to assigned driver',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'maintenance'],
              description: 'Vehicle operational status',
            },
            color: {
              type: 'string',
            },
            make: {
              type: 'string',
              description: 'Vehicle manufacturer',
            },
            model: {
              type: 'string',
              description: 'Vehicle model',
            },
            manufacturerYear: {
              type: 'number',
            },
            notes: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Driver: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique driver identifier',
            },
            name: {
              type: 'string',
              description: 'Driver full name',
            },
            licenseNumber: {
              type: 'string',
              description: 'Driving license number',
            },
            contactNumber: {
              type: 'string',
              description: 'Driver contact phone number',
            },
            email: {
              type: 'string',
              description: 'Driver email address',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
            },
            address: {
              type: 'string',
            },
            emergencyContact: {
              type: 'string',
            },
            vehicleId: {
              type: 'string',
              description: 'Reference to assigned vehicle',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'Driver status',
            },
            licenseExpiryDate: {
              type: 'string',
              format: 'date',
            },
            notes: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LocationPing: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique location ping identifier',
            },
            vehicleId: {
              type: 'string',
              description: 'Reference to vehicle',
            },
            latitude: {
              type: 'number',
              description: 'Location latitude coordinate',
            },
            longitude: {
              type: 'number',
              description: 'Location longitude coordinate',
            },
            accuracy: {
              type: 'number',
              description: 'GPS accuracy in meters',
            },
            speed: {
              type: 'number',
              description: 'Vehicle speed in km/h',
            },
            heading: {
              type: 'number',
              description: 'Direction of movement (0-360 degrees)',
            },
            altitude: {
              type: 'number',
              description: 'Altitude in meters',
            },
            source: {
              type: 'string',
              enum: ['GPS', 'Network', 'Hybrid'],
              description: 'Location source type',
            },
            batteryLevel: {
              type: 'number',
              description: 'Device battery level percentage',
            },
            networkType: {
              type: 'string',
              description: 'Type of network connection',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LastKnownLocation: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique last known location identifier',
            },
            vehicleId: {
              type: 'string',
              description: 'Reference to vehicle',
            },
            latitude: {
              type: 'number',
            },
            longitude: {
              type: 'number',
            },
            accuracy: {
              type: 'number',
            },
            speed: {
              type: 'number',
            },
            heading: {
              type: 'number',
            },
            source: {
              type: 'string',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Location: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            vehicleId: {
              type: 'string',
            },
            latitude: {
              type: 'number',
            },
            longitude: {
              type: 'number',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            accuracy: {
              type: 'number',
            },
            speed: {
              type: 'number',
            },
          },
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app, apiPrefix) => {
  // Use CDN links for Vercel/Serverless deployment compatibility
  const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
  const customJs = [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.min.js"
  ];

  app.use(
    `${apiPrefix}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(specs, { customCssUrl: CSS_URL, customJs })
  );
};

module.exports = {
  setupSwagger,
};
