import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jose Estate API Documentation',
      version: '1.0.0',
      description: 'Interactive API documentation for the Jose Estate Premium Real Estate listing platform (technical assignment).',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token to authorize requests.',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'fullName', 'role', 'mobile'],
                  properties: {
                    fullName: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'johndoe@example.com' },
                    mobile: { type: 'string', example: '+91 9876543210' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', enum: ['BUYER', 'SELLER'], example: 'BUYER' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registration successful' },
            400: { description: 'Validation or duplicate email error' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'User login',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'johndoe@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid email or password' },
          },
        },
      },
      '/auth/logout': {
        post: {
          summary: 'Log out current user',
          tags: ['Authentication'],
          responses: {
            200: { description: 'Logged out successfully' },
          },
        },
      },
      '/auth/me': {
        get: {
          summary: 'Get details of authenticated user',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User details fetched successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/properties': {
        get: {
          summary: 'List all properties with filters',
          tags: ['Properties'],
          parameters: [
            { name: 'stateId', in: 'query', schema: { type: 'string' } },
            { name: 'cityId', in: 'query', schema: { type: 'string' } },
            { name: 'areaId', in: 'query', schema: { type: 'string' } },
            { name: 'type', in: 'query', schema: { type: 'string' } },
            { name: 'bedrooms', in: 'query', schema: { type: 'string' } },
            { name: 'bathrooms', in: 'query', schema: { type: 'string' } },
            { name: 'minPrice', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
            { name: 'minArea', in: 'query', schema: { type: 'number' } },
            { name: 'maxArea', in: 'query', schema: { type: 'number' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'List of properties fetched successfully' },
          },
        },
        post: {
          summary: 'Create a new property listing (Seller only)',
          tags: ['Properties'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'price', 'area', 'bedrooms', 'bathrooms', 'propertyType', 'stateId', 'cityId', 'areaId', 'images'],
                  properties: {
                    title: { type: 'string', example: 'Beautiful 3 BHK Villa' },
                    description: { type: 'string', example: 'Fully furnished, high-class society' },
                    price: { type: 'number', example: 4500000 },
                    area: { type: 'number', example: 1800 },
                    bedrooms: { type: 'integer', example: 3 },
                    bathrooms: { type: 'integer', example: 3 },
                    parking: { type: 'boolean', default: false },
                    propertyType: { type: 'string', enum: ['HOUSE', 'APARTMENT', 'VILLA', 'LAND', 'COMMERCIAL'], example: 'VILLA' },
                    stateId: { type: 'string' },
                    cityId: { type: 'string' },
                    areaId: { type: 'string' },
                    amenityIds: { type: 'array', items: { type: 'string' } },
                    images: { type: 'array', items: { type: 'string', description: 'Base64 image strings' } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Property created successfully, awaiting moderation' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (only SELLER or ADMIN can listing)' },
          },
        },
      },
      '/properties/{id}': {
        get: {
          summary: 'Get details of a specific property',
          tags: ['Properties'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Property details fetched' },
            404: { description: 'Property not found' },
          },
        },
        put: {
          summary: 'Update property details (Only owner before admin approval)',
          tags: ['Properties'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    area: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Property listing updated' },
            400: { description: 'Bad request (cannot edit non-pending listings)' },
            403: { description: 'Forbidden (not the owner)' },
          },
        },
        delete: {
          summary: 'Delete property listing',
          tags: ['Properties'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Property listing deleted' },
            403: { description: 'Forbidden (not the owner)' },
          },
        },
      },
      '/admin/pending': {
        get: {
          summary: 'Get all pending listings awaiting review (Admin only)',
          tags: ['Admin Moderation'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Pending list retrieved' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/admin/approve/{id}': {
        patch: {
          summary: 'Approve a property listing (Admin only)',
          tags: ['Admin Moderation'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Property approved' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/admin/reject/{id}': {
        patch: {
          summary: 'Reject and archive a property listing (Admin only)',
          tags: ['Admin Moderation'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Property rejected' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/enquiries': {
        post: {
          summary: 'Submit a customer enquiry for a property (Buyer only)',
          tags: ['Enquiries'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['propertyId', 'message'],
                  properties: {
                    propertyId: { type: 'string' },
                    message: { type: 'string', example: 'I am interested in this villa, please share the payment options.' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Enquiry submitted successfully' },
            400: { description: 'Duplicate enquiry or spam protection' },
          },
        },
      },
      '/locations/states': {
        get: {
          summary: 'Get list of states',
          tags: ['Locations'],
          responses: {
            200: { description: 'States fetched' },
          },
        },
      },
      '/locations/cities': {
        get: {
          summary: 'Get cities inside a state',
          tags: ['Locations'],
          parameters: [
            { name: 'stateId', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Cities fetched' },
          },
        },
      },
      '/locations/areas': {
        get: {
          summary: 'Get areas inside a city',
          tags: ['Locations'],
          parameters: [
            { name: 'cityId', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Areas fetched' },
          },
        },
      },
    },
  },
  apis: [], // We are providing static definition objects for fast loading
};

export const swaggerSpec = swaggerJSDoc(options);
